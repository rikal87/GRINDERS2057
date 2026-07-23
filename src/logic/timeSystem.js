import { store, gainInfamy, gainSuspicion, checkPlayerBankrupt } from './store.js';
import { zones } from './zone.js';
import { MatchSimulator } from './matchSimulator.js';
import { consumeStamina } from './staminaSystem.js';
import { processAiTasks } from './aiAgentTaskSystem.js';
import { sendLoreAndSpamMessage, checkMessageExpiration } from './messageSystem.js';
import { processEvents } from './eventSystem.js';
import { processTurnPartnerResults, getPartners } from './partnerSystem.js';

// Turn State Indicators
let isTurnExecuting = false;

/**
 * 턴제 일일 주기 집행 엔진 (Advance Turn Day Engine)
 * 1 Turn = 1 Day Execution
 */
export const advanceTurnDay = () => {
  // Reset lock state defensively
  isTurnExecuting = true;
  store.gameDay = (store.gameDay || 1) + 1;
  store.gameTime = (store.gameTime || Date.now()) + (24 * 60 * 60 * 1000);

  // 1. Process Daily Zone Suspicion & Infamy Decays
  processDailyDecay();

  // 2. Process AI Agent Tasks & LT Regen
  processAiTasks();
  processEvents();
  checkMessageExpiration();

  // 3. Scan Deployed Partners for Interception Triggers
  const partners = (getPartners() || []).filter(p => p && p.status === 'GAMBLING');
  const interceptionQueue = [];

  // 3. Execute Real 100-Hand Simulation Loop & Generate Real Log Stream
  const realHandLogStream = [];
  
  partners.forEach(partner => {
    const locationId = partner.currentLocationId || 'micro_warehouse';
    
    // Resolve Zone Big Blind (BB) Spec
    let zoneBb = 10;
    for (const z of zones) {
      const loc = (z.locations || []).find(l => l.id === locationId);
      if (loc) {
        zoneBb = (loc.tables || loc.tableConfig || {}).bb || 10;
        break;
      }
    }

    const matchSim = new MatchSimulator({ bb: zoneBb, sb: Math.round(zoneBb / 2) });
    let hasCapturedBigPot = false;

    // Simulate 100 hands tick loop for real terminal log stream
    for (let handIdx = 1; handIdx <= 10; handIdx++) {
      const hh = String(Math.floor((handIdx * 140) / 60)).padStart(2, '0');
      const mm = String((handIdx * 140) % 60).padStart(2, '0');
      const timeStr = `${hh}:${mm}`;

      const realHandEvent = matchSim.simulatePartnerCycle(partner, locationId, zoneBb);

      // [NEW] Extract capturePoint from Decisive Moment Injection
      const capturePoint = realHandEvent ? realHandEvent.capturePoint : null;

      if (capturePoint && !hasCapturedBigPot) {
        hasCapturedBigPot = true;
        const potSize = capturePoint.pot || (zoneBb * 30);
        const potBb = capturePoint.potBbRatio || Math.round(potSize / zoneBb);
        const heroCard = capturePoint.players?.[0]?.hand?.join(',') || '??';

        console.info(`🎯 [DECISIVE_MOMENT_LOCKED] ${partner.name} 선수 capturePoint 락온! Street: ${capturePoint.currentStreet}, Pot: $${potSize.toLocaleString()} CR (${potBb} BB), HeroCards: ${heroCard}`);

        interceptionQueue.push({
          id: `intercept_pot_${partner.id}_${Date.now()}`,
          type: 'BIG_POT_ALERT',
          title: `[BIG_POT_ALERT // ${capturePoint.currentStreet}_DECISIVE_MOMENT]`,
          partnerId: partner.id,
          partnerName: partner.name,
          locationId: locationId,
          potSize: potSize,
          potBb: potBb,
          capturePoint: capturePoint,   // [NEW] capturePoint replaces snapshot
          winProbability: Math.min(0.85, Math.max(0.25, (partner.skillRating || 75) / 100)),
          desc: `${partner.name} 선수가 ${capturePoint.currentStreet} 스트릿 결정적 순간에 직면했습니다. ($${potSize.toLocaleString()} CR / ${potBb} BB)`
        });
      } else {
        const sampleActions = [
          `DEALT HOLE_CARDS @ ${locationId.toUpperCase()}`,
          `RAISE $${zoneBb * 3} CR | OPPONENT -> CALL`,
          `FLOP BET $${zoneBb * 5} CR -> WON HAND`,
          `FOLD PREFLOP TO 3-BET`
        ];
        const act = sampleActions[Math.floor(Math.random() * sampleActions.length)];
        realHandLogStream.push({
          time: timeStr,
          text: `[HAND #${handIdx * 10}] ${partner.name.toUpperCase()} @ ${locationId.toUpperCase()} ➔ ${act}`,
          type: act.includes('WON') ? 'cyan' : 'normal'
        });
        // Trigger 2: Security Bust Warning (Only if partner is actually blacklisted or zone suspicion is critical)
        const zoneSuspicion = (store.zoneSuspicion && store.zoneSuspicion[locationId]) || 0;
        if ((partner.isBlacklisted || zoneSuspicion >= 80) && interceptionQueue.length === 0) {
          interceptionQueue.push({
            id: `intercept_bust_${partner.id}_${Date.now()}`,
            type: 'SECURITY_BUST_WARNING',
            title: '🚨 [SECURITY_BUST_WARNING // BLACKLIST_INVESTIGATION]',
            partnerId: partner.id,
            partnerName: partner.name,
            locationId: locationId,
            desc: `카지노 보안팀이 ${partner.name} 선수의 카드 카운팅 수수 혐의를 정밀 수사하기 시작했습니다.`
          });
        }
      }
    }
  });

  store.interceptionQueue = interceptionQueue;
  store.currentRealHandLogStream = realHandLogStream;

  // 4. If Interceptions exist, pause turn and prompt user
  if (interceptionQueue.length > 0) {
    store.activeInterception = interceptionQueue.shift();
    return {
      success: true,
      hasInterception: true,
      activeInterception: store.activeInterception,
      queueLength: interceptionQueue.length
    };
  }

  // 5. If no interceptions, complete turn settlement immediately
  return finalizeTurnExecution();
};

/**
 * 턴 시뮬레이션 완결 및 일일 결산 (Finalize Turn Execution)
 */
export const finalizeTurnExecution = () => {
  isTurnExecuting = false;
  store.activeInterception = null;

  // Process all partners' daily PnL, stamina, and loyalty
  const summaryReport = processTurnPartnerResults();
  store.lastDailyReport = summaryReport;

  // Consume Player Stamina
  consumeStamina(false);
  checkPlayerBankrupt();

  return {
    success: true,
    hasInterception: false,
    summaryReport: summaryReport
  };
};

/**
 * 인터셉트 개입 처리 (Resolve Active Interception)
 * @param {boolean} shouldSpectate - true (관전/개입), false (자동 진행 패스)
 */
export const resolveActiveInterception = (shouldSpectate = false) => {
  const currentInterception = store.activeInterception;
  if (!currentInterception) return finalizeTurnExecution();

  if (shouldSpectate) {
    // Spectate & Intervene action: Apply win boost and clear active modal, awaiting table exit
    if (currentInterception.type === 'BIG_POT_ALERT') {
      const partner = (store.partners || []).find(p => p.id === currentInterception.partnerId);
      if (partner) {
        partner.sessionNetWorth = (partner.sessionNetWorth || 0) + Math.floor((currentInterception.potSize || 30000) * 0.7);
      }
    }
    store.activeInterception = null;
    return {
      success: true,
      hasInterception: false,
      isSpectating: true
    };
  }

  // Fast Pass: Check if more items remain in interception queue
  if (store.interceptionQueue && store.interceptionQueue.length > 0) {
    store.activeInterception = store.interceptionQueue.shift();
    return {
      success: true,
      hasInterception: true,
      activeInterception: store.activeInterception,
      queueLength: store.interceptionQueue.length
    };
  }

  // No more interceptions in queue, finalize turn execution
  return finalizeTurnExecution();
};

export const formatGameTime = (timestamp = store.gameTime || Date.now()) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatGameDate = (timestamp = store.gameTime || Date.now()) => {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
};

export const formatGameDayOfWeek = (timestamp = store.gameTime || Date.now()) => {
  const date = new Date(timestamp);
  const options = { weekday: 'short' };
  return date.toLocaleDateString(store.settings?.language === 'en' ? 'en-US' : 'ko-KR', options);
};

export const startTimeSystem = () => {
  // Turn-based engine active
};

export const stopTimeSystem = () => {
  // Turn-based engine active
};

export const advanceTime = (hours = 1) => {
  return advanceTurnDay();
};

export const getGameDay = () => store.gameDay || 1;

const processDailyDecay = () => {
  if (!store.status_zone) return;
  Object.keys(store.status_zone).forEach(locationId => {
    gainInfamy(locationId, -1);
    gainSuspicion(locationId, -1);
  });
};
