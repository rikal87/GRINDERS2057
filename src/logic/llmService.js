import { GoogleGenAI } from '@google/genai';
import { evaluateHand, calculateOuts } from './poker.js';

/**
 * LLM Service for Cyber Poker 2077
 * Orchestrates prompt construction and neural decision logic via the latest Gemini SDK.
 */

const API_KEY = '[ENCRYPTION_KEY]';
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Shared state for the "Neural Processor" to prevent API flooding and manage lockouts
let lastRequestTime = 0;
const MIN_REQUEST_SPACING = 3000; // 3 seconds spacing to be safe for free tier
let globalLockoutUntil = 0; // Lockout timestamp for 429 errors

// JSON Schema for LLM Response
const POKER_DECISION_SCHEMA = {
  type: "object",
  properties: {
    action: { type: "string", enum: ["fold", "call", "raise", "check"] },
    amount: { type: "number", description: "TOTAL ABSOLUTE bet amount for this round." },
    insight: { type: "string", description: "Internal tactical reasoning (max 60 chars)" },
    dialogue: { type: "string", description: "Short in-character dialogue in Korean" }
  },
  required: ["action", "amount", "insight", "dialogue"]
};

export class LLMService {
  /**
   * Constructs the prompt for the LLM
   */
  static constructPrompt(player, engine) {
    const archetype = player.archetype?.name || 'Vanguard';
    const philosophy = player.class.philosophy;
    const hand = player.hand.join(', ');
    const board = engine.board.length > 0 ? engine.board.join(', ') : 'Empty (Pre-flop)';
    const pot = engine.pot;
    const callAmt = engine.currentRoundBet - player.currentBet;
    const foldedCount = engine.players.filter(p => p.isFolded).length;
    const activeCount = engine.players.filter(p => !p.isFolded && p.chips > 0).length;

    // Advanced Equity Calculation
    let strategicAnalysis = "";
    if (engine.state === 'FLOP' || engine.state === 'TURN') {
      const { outs, draws } = calculateOuts(player.hand, engine.board);
      const isTurn = engine.state === 'TURN';
      const equity = Math.min(99, outs * (isTurn ? 2 : 4)); // Rule of 4 and 2

      const totalPot = pot + callAmt;
      const potOdds = totalPot > 0 ? Math.round((callAmt / totalPot) * 100) : 0;

      strategicAnalysis = `
[STRATEGIC_ANALYSIS]
Current_Street: ${engine.state}
Draws_Detected: ${draws.length > 0 ? draws.join(', ') : 'None'}
Outs_Count: ${outs}
Estimated_Equity: ${equity}%
Pot_Odds_To_Call: ${potOdds}%
EV_Guidance: ${equity > potOdds ? 'POSITIVE_EV (Call/Raise recommended)' : 'NEGATIVE_EV (Fold/Bluff only)'}
`;
    }

    // Preflop Sizing Guidance
    if (engine.state === 'PREFLOP') {
      let sizingAdvice = "";
      if (engine.currentRoundBet <= 2) sizingAdvice = "OPEN_RAISE_STRATEGY: Target 2.0x Pot Size.";
      else if (engine.currentRoundBet < 20) sizingAdvice = "3BET_STRATEGY: Target 3.0x - 4.0x current bet.";
      else sizingAdvice = "4BET_STRATEGY: Target 2.5x current bet.";

      strategicAnalysis += `\n[PREFLOP_GUIDANCE]\n${sizingAdvice}\n`;
    }

    return `
[SYSTEM_PROMPT]
You are ${player.name}, a player in the Cyberpoker 2077 simulation.
This is a gritty, high-stakes cyberpunk world. 
Your goal is to win CR (Crypto Credits) while staying in character.

[PERSONA]
Class: ${player.class.name}
Philosophy: ${philosophy}
Archetype: ${archetype}

[STATE_READOUT]
Street: ${engine.state}
My_Hole_Cards: [${hand}]
Board_Memory: [${board}]
Pot_Value: ${pot} CR
Action_Required: Call ${callAmt} CR to stay in the hand.
My_Chips: ${player.chips} CR

[TABLE_INTEL]
Active_Nodes: ${activeCount}
Disconnected_Nodes (Folded): ${foldedCount}
${strategicAnalysis}
[OBJECTIVE]
Analyze the hand strength, draws, and pot odds.
Minimum raise amount if raising: ${Math.max(engine.currentRoundBet * 2, engine.currentRoundBet + 2)} CR.
    `;
  }

  /**
   * Call Gemini for a neural decision with global lockout prevention.
   */
  static async getNeuralDecision(player, engine) {
    throw new Error('LLM Service is disabled for Tauri build.');
  }
}
