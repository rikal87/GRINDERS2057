import { PLAY_RECORD_STATS_TYPE } from './playRecordStats.js'

export const recordPlayStatsSessionForCPU = (player, action, payload = {}) => {
  const sessionStats = player.stats;
  if (action === PLAY_RECORD_STATS_TYPE.HANDS_PLAYED || action === PLAY_RECORD_STATS_TYPE.VPIP || action === PLAY_RECORD_STATS_TYPE.PFR) {
    console.info('[PLAY_RECORD_STATS_CPU] Before:', action, sessionStats.handsPlayed);
  }
  switch (action) {
    case PLAY_RECORD_STATS_TYPE.BET:
    case PLAY_RECORD_STATS_TYPE.RAISE:
      sessionStats.aggressiveActions++;
      break;
    case PLAY_RECORD_STATS_TYPE.CALL:
      sessionStats.calls++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLD:
      sessionStats.fold++;
      break;
    case PLAY_RECORD_STATS_TYPE.CHECK:
      sessionStats.check++;
      break;
    case PLAY_RECORD_STATS_TYPE.ALL_IN:
      sessionStats.all_in++;
      break;
    case PLAY_RECORD_STATS_TYPE.WIN:
      sessionStats.win++;
      sessionStats.currentLoseStreak = 0
      sessionStats.currentWinStreak++;
      if (sessionStats.currentWinStreak > sessionStats.maxWinStreak) {
        sessionStats.maxWinStreak = sessionStats.currentWinStreak;
      }
      sessionStats.max_win_equity = Math.max(payload.equity || 0, sessionStats.max_win_equity);
      if (payload.rake) {
        sessionStats.paid_rake += payload.rake;
      }
      if (payload.rakeSaved) {
        sessionStats.rake_saved += payload.rakeSaved;
      }
      if (payload.isShowDown) {
        sessionStats.w$sd++;
      }
      break;
    case PLAY_RECORD_STATS_TYPE.LOSE:
      sessionStats.lose++;
      sessionStats.currentWinStreak = 0
      sessionStats.currentLoseStreak++;
      if (sessionStats.currentLoseStreak > sessionStats.maxLoseStreak) {
        sessionStats.maxLoseStreak = sessionStats.currentLoseStreak;
      }
      sessionStats.maxLoseEquity = Math.max(payload.equity || 0, sessionStats.maxLoseEquity);
      sessionStats.maxLosePot = Math.max(payload.pot || 0, sessionStats.maxLosePot);
      break;
    case PLAY_RECORD_STATS_TYPE.BUST:
      sessionStats.bust++;
      break;
    case PLAY_RECORD_STATS_TYPE.BANKRUPT:
      sessionStats.bankrupt++;
      break;
    case PLAY_RECORD_STATS_TYPE.VPIP:
      sessionStats.vPIPCount++;
      break;
    case PLAY_RECORD_STATS_TYPE.PFR:
      sessionStats.pfrCount++;
      break;
    case PLAY_RECORD_STATS_TYPE.WTSD:
      sessionStats.wtsd++;
      break;
    case PLAY_RECORD_STATS_TYPE.WSD:
      sessionStats.wsd++;
      break;
    case PLAY_RECORD_STATS_TYPE.W$SD:
      sessionStats.w$sd++;
      break;
    case PLAY_RECORD_STATS_TYPE.HANDS_PLAYED:
      sessionStats.handsPlayed++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_RAISE:
      sessionStats.faced_raise++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_3BET:
      sessionStats.faced_3bet++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_4BET_OR_MORE:
      sessionStats.faced_4bet_or_more++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_RAISE:
      sessionStats.folded_to_raise++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_3BET:
      sessionStats.folded_to_3bet++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_4BET_OR_MORE:
      sessionStats.folded_to_4bet_or_more++;
      break;
    case PLAY_RECORD_STATS_TYPE.FOLDED_TO_FLOP_BET:
      sessionStats.foldedToFlopBet++;
      break;
    case PLAY_RECORD_STATS_TYPE.FACED_FLOP_BET:
      sessionStats.facedFlopBet++;
      break;
    case PLAY_RECORD_STATS_TYPE._3BET:
      sessionStats.threeBetCount++;
      break;
    case PLAY_RECORD_STATS_TYPE._4BET_OR_MORE:
      sessionStats.fourBetOrMoreCount++; // Simplified for CPU for now
      break;
    case PLAY_RECORD_STATS_TYPE.NET_WINNING:
      sessionStats.net_winning += payload.amount;
      break;
  }
}
