const fs = require('fs');

try {
  let content = fs.readFileSync('d:/github-repository/CyberPoker2077/src/logic/itemsEffect.js', 'utf8');
  console.log("Read source file length:", content.length);

  // 1. Add missing import at the top
  if (!content.includes("import { store }")) {
    content = "import { store } from './store.js';\n" + content;
  }

  // Helper to replace whole lines for safe insertion
  function replaceName(ko, en) {
    const target = `name: '${ko}',`;
    const replacement = `name_ko: '${ko}',\n    name_en: '${en}',\n    get name() { return store.settings.language === 'en' ? this.name_en : this.name_ko; },`;
    let before = content.length;
    content = content.replaceAll(target, replacement);
  }

  function replaceDesc(koFull, enFull) {
    const target = `get desc() { return \`${koFull}\` },`;
    const replacement = `get desc() { return store.settings.language === 'en' ? \`${enFull}\` : \`${koFull}\`; },`;
    content = content.replaceAll(target, replacement);
  }

  // Names mapping
  const names = {
    '스태미나 회복': 'Stamina Regen',
    '도파민 중독': 'Dopamine Addiction',
    '입장 권한': 'Entry Pass',
    '입장권한': 'Entry Pass',
    '블랙 컨슈머': 'Black Consumer',
    '경험치 부스트': 'XP Boost',
    '손실 보존': 'Loss Preservation',
    'LT 회복': 'LT Recovery',
    '타임 뱅크 추가': 'Time Bank Expansion',
    '잔돈 모으기': 'Spare Change',
    '초기 자금 보너스': 'Initial Bankroll Bonus',
    '수수료 감면': 'Rake Reduction',
    'LT 회복량 증가': 'Enhanced LT Regen',
    '바이인 배수': 'Buy-In Multiplier',
    '블라인드 할인': 'Blind Discount',
    '단골 우대': 'Loyalty Card',
    '보너스 배당': 'Pot Bonus',
    '인슈어런스': 'Insurance',
    '마이더스의 손': 'Midas Touch',
    '양자 행운': 'Quantum Luck',
    '다이아 수집가': 'Diamond Collector',
    '하트 수집가': 'Heart Collector',
    '스페이드 수집가': 'Spade Collector',
    '클럽 수집가': 'Club Collector',
    '럭키 7 수집가': 'Lucky 7 Collector',
    '징조': 'The Omen',
    '플러시 전문가': 'Flush Master',
    '풀 옵션 펜트하우스': 'Full Option Penthouse',
    '스트레이트 플러시 전문가': 'Straight Flush Master',
    '포카드 전문가': 'Quads Master',
    '왕의 물내림': 'Royal Execution',
    '블랙잭 전문가': 'Blackjack Master',
    '페어 전문가': 'Pair Master',
    '세트 메뉴': 'Set Menu',
    '쿨러': 'Cooler',
    '아, 킥커 차이..': 'Outkicked...',
    '실패는 성공의 어머니': 'Failure is the Mother of Success',
    '틸트 회복': 'Tilt Recovery',
    '더블 다운': 'Double Down',
    '유령 배팅': 'Ghost Bet',
    '승리의 기쁨': 'Joy of Victory',
    '배수의 진': 'Last Stand',
    '연승 마스터': 'Streak Master',
    '양자 폴드': 'Quantum Fold',
    '시냅스 리딩': 'Synapse Reading',
  };

  for (const [ko, en] of Object.entries(names)) {
    replaceName(ko, en);
  }

  // Desc mappings (exact contents between the backticks)
  const descs = [
    ['라운드 시작시 스테미나 회복 +${this.value} (쿨타임 ${this.maxCooldown} 라운드)', 'Restores Stamina +${this.value} at round start (Cooldown: ${this.maxCooldown} rounds)'],
    ['올인 쇼다운에서 승리 또는 패배시 스테미나 +${this.value} (쿨타임 ${this.maxCooldown} 라운드)', 'Restores +${this.value} Stamina upon winning or losing an All-In Showdown. (Cooldown: ${this.maxCooldown} rounds)'],
    ['구매시 "지하 바" 이용가능.', 'Grants access to the "Underground Bar".'],
    ['구매시 "오르빗" 이용가능.', 'Grants access to "Orbit".'],
    ['구매시 "H.B.D 클럽" 이용가능.', 'Grants access to the "H.B.D Club".'],
    ['구매시 암상인 뇌물 레벨이 ${this.value}가 됩니다.(1회성)', 'Sets Black Market bribe level to ${this.value}. (One-time use)'],
    ['구매시 "더 벙커" 이용가능.', 'Grants access to "The Bunker".'],
    ['구매시 "홀덤 하우스" 이용가능.', 'Grants access to "Hold\'em House".'],
    ['구매시 "로얄 프라이빗 룸" 이용가능.', 'Grants access to "Royal Private Room".'],
    ['승리시 경험치 +${Math.floor(this.value * 100)}%', 'Grants +${Math.floor(this.value * 100)}% XP upon winning'],
    ['쇼다운 패배 시 손실액 ${Math.floor(this.value * 100)} % 환급 (쿨타임: ${this.maxCooldown} 라운드)', 'Refunds ${Math.floor(this.value * 100)}% of lost chips upon losing a Showdown (Cooldown: ${this.maxCooldown} rounds)'],
    ['승리시 LT +${this.value}', 'Restores +${this.value} LT upon winning'],
    ['생각 시간 +${this.value}초', 'Increases decision time by +${this.value} seconds'],
    ['승리 시 본인 배팅 총액을 ${Math.pow(10, this.value)}단위로 올림하여 획득합니다.', 'Rounds up your total bet amount to the nearest ${Math.pow(10, this.value)} units when winning.'],
    ['파산 시 다음 초기 자금 +${Math.floor(this.value * 100)}% (쿨타임: ${this.maxCooldown} 라운드)', 'Increases next starting bankroll by +${Math.floor(this.value * 100)}% (Cooldown: ${this.maxCooldown} rounds)'],
    ['카지노 레이크 수수료 -${Math.floor(this.value * 100)}%', 'Reduces casino rake by -${Math.floor(this.value * 100)}%'],
    ['라운드시 시작시 LT +${Math.floor(this.value)} 회복 (쿨타임: ${this.maxCooldown} 라운드)', 'Restores +${Math.floor(this.value)} LT at the start of a round (Cooldown: ${this.maxCooldown} rounds)'],
    ['바이인 배수 +${Math.floor(this.value * 100)}%', 'Increases buy-in multiplier by +${Math.floor(this.value * 100)}%'],
    ['블라인드 비용 -${Math.floor(this.value * 100)}%', 'Reduces blind cost by -${Math.floor(this.value * 100)}%'],
    ['암상인 취급 최대 물품수 +${Math.floor(this.value)}', 'Increases the max number of items offered by Black Market by +${Math.floor(this.value)}'],
    ['승리 시 본인 지분의 ${Math.floor(this.value * 100)}% 만큼 뱅크롤로 입금 (쿨타임: ${this.maxCooldown} 라운드)', 'Deposits ${Math.floor(this.value * 100)}% of your pot share into your bankroll on win (Cooldown: ${this.maxCooldown} rounds)'],
    ['올인 쇼다운 시점 승률이 75% 이상일때, 패배시 승률의 ${Math.floor(this.value * 100)}% 만큼 CR 보전', 'Refunds CR equal to ${Math.floor(this.value * 100)}% of your equity if you lose an All-In Showdown with >75% equity.'],
    ['획득하는 경험치의 ${Math.floor(this.value * 100)}% 만큼의 CR이 뱅크롤에 추가됩니다.', 'Adds CR equivalent to ${Math.floor(this.value * 100)}% of the XP you gain to your bankroll.'],
    ['올인 쇼다운 시점 승률이 50% 미만일때 발동되며, 승리시 부족한 승률 만큼의 팟 보너스 ${Math.floor(this.value * 100)}% (쿨타임: ${this.maxCooldown} 라운드)', 'If you win an All-In Showdown with <50% equity, grants a pot bonus of ${Math.floor(this.value * 100)}% (Cooldown: ${this.maxCooldown} rounds)'],
    ['승리시 본인 지분의 팟 보너스 ${Math.floor(this.value * 100)} * (보드+핸드 다이아 문양 수)% (쿨타임: ${this.maxCooldown} 라운드)', 'Pot bonus: ${Math.floor(this.value * 100)} * (Number of Diamonds)% on win (Cooldown: ${this.maxCooldown} rounds)'],
    ['승리시 본인 지분의 팟 보너스 ${Math.floor(this.value * 100)} * (보드+핸드 하트 문양 수)% (쿨타임: ${this.maxCooldown} 라운드)', 'Pot bonus: ${Math.floor(this.value * 100)} * (Number of Hearts)% on win (Cooldown: ${this.maxCooldown} rounds)'],
    ['승리시 본인 지분의 팟 보너스 ${Math.floor(this.value * 100)} * (보드+핸드 스페이드 문양 수)% (쿨타임: ${this.maxCooldown} 라운드)', 'Pot bonus: ${Math.floor(this.value * 100)} * (Number of Spades)% on win (Cooldown: ${this.maxCooldown} rounds)'],
    ['승리시 본인 지분의 팟 보너스 ${Math.floor(this.value * 100)} * (보드+핸드 클럽 문양 수)% (쿨타임: ${this.maxCooldown} 라운드)', 'Pot bonus: ${Math.floor(this.value * 100)} * (Number of Clubs)% on win (Cooldown: ${this.maxCooldown} rounds)'],
    ['승리시 본인 지분의 팟 보너스 ${Math.floor(this.value * 100)} * (보드+핸드 7의 개수)% (쿨타임: ${this.maxCooldown} 라운드)', 'Pot bonus: ${Math.floor(this.value * 100)} * (Number of 7s)% on win (Cooldown: ${this.maxCooldown} rounds)'],
    ['패배시 본인 지분의 팟 보너스 ${Math.floor(this.value * 100)} * (보드+핸드 6의 개수)% (쿨타임: ${this.maxCooldown} 라운드)', 'Pot refund: ${Math.floor(this.value * 100)} * (Number of 6s)% on loss (Cooldown: ${this.maxCooldown} rounds)'],
    ['플러시로 승리시 경험치 보너스 +${Math.floor(this.value * 100)}%', 'Grants +${Math.floor(this.value * 100)}% XP bonus when winning with a Flush.'],
    ['풀하우스로 승리시 경험치 보너스 +${Math.floor(this.value * 100)}%', 'Grants +${Math.floor(this.value * 100)}% XP bonus when winning with a Full House.'],
    ['스트레이트 플러시로 승리시 경험치 보너스 +${Math.floor(this.value * 100)}%', 'Grants +${Math.floor(this.value * 100)}% XP bonus when winning with a Straight Flush.'],
    ['포 카드로 승리시 경험치 보너스 +${Math.floor(this.value * 100)}%', 'Grants +${Math.floor(this.value * 100)}% XP bonus when winning with Four of a Kind.'],
    ['로열 플러시로 승리시 경험치 보너스 +${Math.floor(this.value * 100)}%', 'Grants +${Math.floor(this.value * 100)}% XP bonus when winning with a Royal Flush.'],
    ['내 핸드가 AJ인 경우, 다음 승리시 까지 경험치 보너스 +${Math.floor(this.value * 100)}%', 'If your hand is AJ, grants +${Math.floor(this.value * 100)}% XP bonus that persists until your next win.'],
    ['원페어 또는 투페어로 승리시 경험치 보너스 +${Math.floor(this.value * 100)}%', 'Grants +${Math.floor(this.value * 100)}% XP bonus when winning with One Pair or Two Pair.'],
    ['세트로 승리시 경험치 보너스 +${Math.floor(this.value * 100)}%', 'Grants +${Math.floor(this.value * 100)}% XP bonus when winning with a Set.'],
    ['쇼다운에서 풀하우스 이상의 족보로 패배시, 다음 승리 경험치 보너스 +${Math.floor(this.value * 100)}%', 'If you lose a Showdown with a Full House+, grants +${Math.floor(this.value * 100)}% XP bonus on your next win.'],
    ['쇼다운에서 같은 족보로 패배시, 다음 승리 경험치 보너스 +${Math.floor(this.value * 100)}%', 'If you lose a Showdown to the same rank (kicked out), grants +${Math.floor(this.value * 100)}% XP bonus on your next win.'],
    ['쇼다운에서 승리시 경험치 보너스 +${Math.floor(this.value * (this.stack + 1) * 100)}%\\n(이 효과는 쇼다운에서 패배할 때마다 누적되며, 승리할때 초기화.)', 'Grants +${Math.floor(this.value * (this.stack + 1) * 100)}% XP bonus upon winning a Showdown.\\n(Accumulates upon losing, resets on valid win.)'],
    ['쇼다운 패배 시 스테미나 +${this.value}', 'Restores +${this.value} Stamina upon losing a Showdown.'],
    ['스트레이트 족보로 승리 시 경험치 보너스 +${Math.floor(this.value * 100)}%', 'Grants +${Math.floor(this.value * 100)}% XP bonus when winning with a Straight.'],
    ['배팅 시 ${Math.floor(this.value * 100)}% 확률로 배팅 금액을 환급', 'Grants a ${Math.floor(this.value * 100)}% chance to refund your bet amount.'],
    ['쇼다운에서 승리시 스테미나 +${this.value}', 'Restores +${this.value} Stamina upon winning a Showdown.'],
    ['라운드 시작시, 보유 칩이 25BB 이하일 때 LT +${this.value} 회복', 'Restores +${this.value} LT at round start if your stack is <= 25BB.'],
    ['승리할때 마다 경험치 보너스 +${Math.floor(this.value * (this.stack + 1) * 100)}% (이 효과는 승리할때 마다 누적되며, 쇼다운 패배시 초기화.)', 'Grants +${Math.floor(this.value * (this.stack + 1) * 100)}% XP bonus per win. (Accumulates with wins, resets upon losing a Showdown.)'],
    ['프리플랍에서 폴드 시 배팅한 칩의 ${Math.floor(this.value * 100)}% 환급 (쿨타임: ${this.maxCooldown} 라운드)', 'Refunds ${Math.floor(this.value * 100)}% of your wagered chips when folding Pre-Flop. (Cooldown: ${this.maxCooldown} rounds)'],
    ['해당 라운드에서 CPU 플레이어들의 생각을 훔쳐볼 수 있다. (쿨타임: ${this.maxCooldown} 라운드)', 'Allows you to intercept the thoughts of CPU players this round. (Cooldown: ${this.maxCooldown} rounds)'],
  ];

  descs.forEach(([koFull, enFull]) => {
    replaceDesc(koFull, enFull);
  });

  console.log("Written output length:", content.length);
  fs.writeFileSync('d:/github-repository/CyberPoker2077/src/logic/itemsEffect.js', content, 'utf8');
} catch (e) {
  console.error("Error executing replacement:", e)
}
