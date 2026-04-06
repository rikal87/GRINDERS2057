import { getHandTierHeuristic, analyzeBoardTexture, evaluateHand } from './poker.js';
import { CONTRACT_TYPE } from './constants.js';
import { sendMessage, MESSAGE_TYPE } from './messageSystem.js';
import { getLanguage } from './store.js';
import { COLLUSION_SIGNALS, COLLUSION_FEEDBACK } from './eventSystemFlorence.js';
import { gainRelationship } from './partnerSystem.js';

const sendCollusionMsg = (id, msgTemplate) => {
  const lang = getLanguage();
  const text = msgTemplate[lang] || msgTemplate.en;
  console.info('sendCollusionMsg', text)
  sendMessage(MESSAGE_TYPE.SOCIAL, text, '', [], id, 60);
};

/**
 * [COLLUSION Helper] 시그널 중복 발송 방지 및 상태 업데이트
 */
const emitCollusionSignal = (player, signal, human = null, expectation = null) => {
  if (player.lastCollusionStrategy === signal) return false;

  sendCollusionMsg(player.personaId, signal);
  player.lastCollusionStrategy = signal;

  if (human && expectation) {
    human.collusionExpectation = expectation;
  }
  return true;
};

/**
 * [COLLUSION] 전략적 담합 액션 보정기
 * EV 극대화 원칙: 핸드 강도에 따른 역할 분담. 약속/강제 콜 없음.
 * - 파트너 강함: 자신도 레이즈로 팟 빌딩 + 유저에게 지원 요청
 * - 유저 강함: 파트너가 레이즈로 팟 키워줌 (자신 핸드가 justify할 때만)
 * - 파트너 약함: 즉시 폴드하여 칩 아낌 (약속 없음)
 */
export const applyPartnerCollusion = (player, engine, action) => {
  if (!player.isPartner) return action;

  const collusionContract = player.contracts?.find(c => c.type === CONTRACT_TYPE.COLLUSION && c.active);
  if (!collusionContract) return action;

  const human = engine.players.find(p => p.isHuman);
  if (!human) return action;

  const street = (engine.state || '').toUpperCase();
  const activePlayers = engine.players.filter(p => !p.isFolded && !p.isEliminated);
  const isOnlyWithHuman = activePlayers.length === 2 && activePlayers.some(p => p.isHuman);

  const humanTier = getHandTierHeuristic(human.hand, engine.board, street);
  const partnerTier = getHandTierHeuristic(player.hand, engine.board, street);
  const tierPower = { 'MONSTER': 4, 'STRONG': 3, 'NORMAL': 2, 'WEAK': 1 };
  const humanPower = tierPower[humanTier] || 0;
  const partnerPower = tierPower[partnerTier] || 0;

  // ─── 1. 팀 절약 (둘만 남았을 때) ───────────────────────────────────────────
  if (isOnlyWithHuman) {
    human.collusionExpectation = { action: ['check', 'call'], type: 'TEAM_SAVINGS', street };
    if (action.action === 'raise') {
      action.action = 'call';
      action.type = 'call';
      action.amount = engine.currentRoundBet || 0;
      action.insight += ' [Collusion: Team Savings]';
    }
    // 유저가 더 강하면 팟 양보
    if (humanPower > partnerPower && engine.currentRoundBet > player.currentBet) {
      action.action = 'fold';
      action.type = 'fold';
      action.amount = 0;
      action.insight += ' [Collusion: Strategic Concession]';
    }
    return action;
  }

  // ─── 2. 파트너 WEAK → 즉시 후퇴 (칩 절약 = 팀 EV+) ────────────────────────
  if (partnerTier === 'WEAK' && !human.isFolded) {
    if (action.action !== 'fold' && engine.currentRoundBet > player.currentBet) {
      action.action = 'fold';
      action.type = 'fold';
      action.amount = 0;
      action.insight += ' [Collusion: EV Retreat]';
    }
    return action;
  }

  // ─── 4. 유저 STRONG/MONSTER, 파트너 NORMAL+ → 파트너가 스퀴즈/레이즈로 팟 키워줌 ──
  if (['MONSTER'].includes(humanTier) && partnerTier === 'NORMAL' && !human.isFolded) {
    // 기대치 설정: 유저는 공격적으로 대응 가능
    human.collusionExpectation = { action: ['call', 'raise'], type: 'FAILED_TO_SUPPORT', street };
  }

  // ─── 5. 유저가 WEAK → 폴드 권고 기대치 설정 (베팅 유무로 check/call 구분) ──────
  if (humanTier === 'WEAK' && !human.isFolded) {
    if (engine.currentRoundBet > human.currentBet) {
      // 베팅/레이즈가 있는 상황 → 콜은 손해, 폴드만 권고
      human.collusionExpectation = { action: ['fold'], type: 'IGNORE_ADVICE', street };
    } else {
      // 체크 가능한 상황 → 체크는 허용, 레이즈만 위반으로 간주
      human.collusionExpectation = { action: ['call', 'fold'], type: 'IGNORE_ADVICE', street };
    }
  }

  return action;
};

/**
 * [COLLUSION Helper] 실시간 핸드 등급(Tier) 계산
 */
const getTierHeuristic = (hand, board, state) => {
  return getHandTierHeuristic(hand, board, state);
};

/**
 * [COLLUSION] 파트너 초기화 및 프리플랍 신호 발송
 * 핸드가 시작될 때 파트너의 상태를 유저에게 알립니다. (startNewHand에서 호출)
 */
export const initPartnerCollusion = (player, engine) => {
  if (!player.isPartner || player.isEliminated || player.isFolded) return;
  const collusionContract = player.contracts?.find(c => c.type === CONTRACT_TYPE.COLLUSION && c.active);
  if (!collusionContract) return;

  const human = engine.players.find(p => p.isHuman);
  const partnerTier = getTierHeuristic(player.hand, engine.board, 'PREFLOP');
  const playerTier = human ? getTierHeuristic(human.hand, engine.board, 'PREFLOP') : 'NORMAL';

  // 프리플랍 시작 시점에 파트너와 플레이어의 핸드 상태를 분석하여 전술적 신호 발송
  let signal = null;
  if (['MONSTER'].includes(partnerTier) && ['MONSTER'].includes(playerTier)) {
    signal = COLLUSION_SIGNALS.DOUBLE_MONSTER;
  } else if (['MONSTER'].includes(partnerTier)) {
    signal = COLLUSION_SIGNALS.SUPPORT_ME;
  } else if (partnerTier === 'NORMAL' && ['MONSTER'].includes(playerTier)) {
    signal = COLLUSION_SIGNALS.WATCHING_SUPPORT;
  } else if (['MONSTER'].includes(playerTier)) {
    signal = COLLUSION_SIGNALS.PLAYER_STRONG;
  }

  if (signal) emitCollusionSignal(player, signal);

  player.lastCollusionStreet = 'PREFLOP';
};

/**
 * [COLLUSION] 파트너 전략 신호 관리
 * 보드 상황과 핸드 상태를 분석하여 유저에게 전술적 신호를 발송합니다.
 */
export const handlePartnerCollusionSignals = (player, action, engine) => {
  if (!player.isPartner || player.isEliminated || player.isFolded) return;
  const collusionContract = player.contracts?.find(c => c.type === CONTRACT_TYPE.COLLUSION && c.active);
  if (!collusionContract) return;

  // 1. Team Savings 시그널
  if (action.insight && action.insight.includes('Team Savings')) {
    sendCollusionMsg(player.personaId, COLLUSION_SIGNALS.TEAM_SAVINGS);
    return;
  }

  // 2. 파트너 및 플레이어 상태 분석
  const human = engine.players.find(p => p.isHuman);
  if (!human || human.isFolded) return;
  const currentStreet = (engine.state || '').toUpperCase();

  const playerTier = getTierHeuristic(human.hand, engine.board, engine.state);
  const partnerTier = getTierHeuristic(player.hand, engine.board, engine.state);
  const activePlayers = engine.players.filter(p => !p.isFolded && !p.isEliminated);

  if (player.lastCollusionStreet === engine.state) return;

  // --- 포스트플랍 전술 페이즈 (적이 한 명이 아니라도 발동) ---
  if (engine.state !== 'PREFLOP' && activePlayers.length >= 2) {
    let signal = null;
    let expectation = null;
    if (['MONSTER'].includes(partnerTier) && ['MONSTER'].includes(playerTier)) {
      signal = COLLUSION_SIGNALS.DOUBLE_MONSTER;
    } else if (['MONSTER'].includes(partnerTier)) {
      signal = COLLUSION_SIGNALS.SUPPORT_ME;
    } else if (partnerTier === 'NORMAL' && ['MONSTER'].includes(playerTier)) {
      signal = COLLUSION_SIGNALS.WATCHING_SUPPORT;
    } else if (['MONSTER'].includes(playerTier)) {
      signal = COLLUSION_SIGNALS.PLAYER_STRONG;
    } else if (playerTier === 'WEAK') {
      signal = COLLUSION_SIGNALS.PLAYER_WEAK;
      // 베팅이 있으면 call은 위반, 체크 가능 상황이면 check는 허용
      if (engine.currentRoundBet > 0) {
        expectation = { action: ['fold'], type: 'IGNORE_ADVICE', street: currentStreet };
      } else {
        expectation = { action: ['fold', 'call'], type: 'IGNORE_ADVICE', street: currentStreet };
      }
    } else if (partnerTier === 'WEAK') {
      signal = COLLUSION_SIGNALS.PARTNER_WEAK;
    } else if (engine.board.length >= 3) {
      const texture = analyzeBoardTexture(engine.board);
      if (texture.score >= 8) {
        signal = COLLUSION_SIGNALS.FOLD_ADVICE;
        // 베팅이 있으면 call은 위반, 체크 가능 상황이면 check는 허용
        if (engine.currentRoundBet > 0) {
          expectation = { action: ['fold'], type: 'IGNORE_ADVICE', street: currentStreet };
        } else {
          expectation = { action: ['fold', 'call'], type: 'IGNORE_ADVICE', street: currentStreet };
        }
      }
    }

    if (signal) {
      emitCollusionSignal(player, signal, human, expectation);
    }
    player.lastCollusionStreet = engine.state;
  }
};

/**
 * [COLLUSION] 플레이어 전략 이행 검증
 * 유저의 액션이 파트너의 의도와 일치하는지 확인하고 피드백을 발송합니다.
 */
export const validateCollusionCompliance = (player, action, engine) => {
  if (!player.isHuman || !player.collusionExpectation) return;

  const { action: expected, type, street } = player.collusionExpectation;
  const currentStreet = (engine.state || '').toUpperCase();

  if (street !== currentStreet) {
    player.collusionExpectation = null;
    return;
  }

  const actualAction = (action.action || action.type || '').toLowerCase();

  // 폴드했거나, 체크 상황(베팅 없음)에서 'check'를 한 경우 항상 compliant로 인정
  const isCheckableStreet = (engine.currentRoundBet || 0) === 0;
  if (actualAction === 'fold' || (actualAction === 'check' && isCheckableStreet)) {
    player.collusionExpectation = null;
    return;
  }

  if (!expected.includes(actualAction)) {
    const partner = engine.players.find(p => p.isPartner);
    if (partner) {
      let feedbackType = type;
      const activePlayers = engine.players.filter(p => !p.isFolded && !p.isEliminated);
      const isOnlyWithPartner = activePlayers.length === 2 && activePlayers.some(p => p.isPartner);

      if (isOnlyWithPartner && actualAction === 'raise') {
        feedbackType = 'ATTACK_PARTNER';
      }

      const feedback = COLLUSION_FEEDBACK[feedbackType];
      if (feedback) {
        setTimeout(() => {
          sendCollusionMsg(partner.personaId, feedback);
          gainRelationship(partner.id, -50);
        }, 800);
      }
    }
  }
  player.collusionExpectation = null;
};
