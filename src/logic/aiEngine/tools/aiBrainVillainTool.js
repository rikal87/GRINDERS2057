/**
 * [Tool] Villain Profiling Tool
 * Analyzes opponent stats and behavior history.
 */
export function profileVillain(context) {
  const { player, engine } = context;
  
  // Find primary opponent (usually the one in the pot)
  const opponent = engine.players.find(p => p.isHuman && !p.isFolded) 
                || engine.players.find(p => p.id !== player.id && !p.isFolded);
                
  if (!opponent) return getDefaultProfile();

  const rawStats = opponent.stats || {};
  const handsPlayed = rawStats.handsPlayed || 0;
  const confidence = Math.min(1, handsPlayed / 10);
  const defStats = { vPIP: 0.30, foldToFlop: 0.5, aggressionFactor: 1.5 };

  const calcVPIP = handsPlayed > 0 ? ((rawStats.vpipCount || 0) / handsPlayed) : 0.30;
  const f2fCount = (rawStats.foldsPerStreet && rawStats.foldsPerStreet.FLOP) || 0;
  const calcF2F = handsPlayed > 0 ? (f2fCount / Math.max(1, handsPlayed * 0.4)) : 0.5;

  const vPIP = (calcVPIP * confidence) + (defStats.vPIP * (1 - confidence));
  const f2f = (calcF2F * confidence) + (defStats.foldToFlop * (1 - confidence));
  const af = (rawStats.betsCount || 0) / Math.max(1, rawStats.callsCount || 0);

  const isManiac = vPIP > 0.42 && (af > 3.0 || af === Infinity);
  const isStation = (vPIP > 0.45 && af < 0.8) || (vPIP > 0.60 && f2f < 0.3);

  const { weaknessLevel, exploitTrigger } = analyzeWeakness(opponent.id, context.actionHistory, context.street);
  
  return {
    id: opponent.id,
    vPIP,
    f2f,
    af,
    isManiac,
    isStation,
    confidence,
    rangeEstimate: `Top ${Math.round(vPIP * 100)}%`,
    weaknessLevel,
    exploitTrigger
  };
}

/**
 * [v23] Analyzes action history for this hand to find specific weakness patterns.
 */
function analyzeWeakness(oppId, history, currentStreet) {
  if (!history || history.length === 0) return { weaknessLevel: 0, exploitTrigger: null };

  const oppActions = history.filter(a => a.playerId === oppId);
  if (oppActions.length === 0) return { weaknessLevel: 0, exploitTrigger: null };

  let level = 0;
  let trigger = null;

  // Pattern 1: PFR_PASSED (Villain raised preflop but checked the flop)
  const pfr = history.find(a => a.street?.toUpperCase() === 'PREFLOP' && a.playerId === oppId && a.action?.toLowerCase() === 'raise');
  const flopCheck = history.find(a => a.street?.toUpperCase() === 'FLOP' && a.playerId === oppId && a.action?.toLowerCase() === 'check');
  
  if (pfr && flopCheck) {
    level = 0.6;
    trigger = 'PFR_PASSED';
  }

  // Pattern 2: REPEATED_CHECK (Checked multiple streets in a row)
  const streetChecks = oppActions.filter(a => a.action?.toLowerCase() === 'check').length;
  if (streetChecks >= 2) {
    level = Math.max(level, 0.4 + (streetChecks * 0.1));
    trigger = trigger || 'REPEATED_CHECK';
  }

  return { weaknessLevel: level, exploitTrigger: trigger };
}

function getDefaultProfile() {
  return {
    vPIP: 0.3, 
    f2f: 0.5, 
    af: 1.5, 
    isManiac: false, 
    isStation: false, 
    confidence: 0, 
    rangeEstimate: 'Unknown',
    weaknessLevel: 0,
    exploitTrigger: null
  };
}
