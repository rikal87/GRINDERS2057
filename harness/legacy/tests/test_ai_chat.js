import fs from 'fs';
import { getAIChat, CHAT_TRIGGERS } from './src/logic/AIChatSystem.js';

const logFile = 'test_output.txt';
function log(msg) {
  fs.appendFileSync(logFile, msg + '\n');
  console.log(msg);
}

// Clear log file
if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

log('--- Testing AI Chat System ---');

// Mock EventAdaptor
const mockEventAdaptor = {
  chat: ({ playerId, message }) => {
    log(`[CHAT_EVENT] ${playerId}: ${message}`);
  }
};

// Mock Engine State
const mockPlayers = [
  { id: 'player', isHuman: true, class: { name: 'Player' } },
  { id: 'cpu_1', isHuman: false, class: { name: 'Vanguard' } },
  { id: 'cpu_2', isHuman: false, class: { name: 'Maniac' } }
];


// Test 1: Game Start
log('\nTest 1: Game Start Trigger');
const msg1 = getAIChat(CHAT_TRIGGERS.GAME_START, 'Vanguard');
log(`Vanguard says: ${msg1}`);
if (!msg1) log('FAIL: No message for Vanguard Game Start');

const msg2 = getAIChat(CHAT_TRIGGERS.GAME_START, 'Maniac');
log(`Maniac says: ${msg2}`);
if (!msg2) log('FAIL: No message for Maniac Game Start');

// Test 2: Huge Win
log('\nTest 2: Huge Win Trigger');
const msg3 = getAIChat(CHAT_TRIGGERS.WIN_HUGE, 'Sentinel');
log(`Sentinel says: ${msg3}`);

// Test 3: Integration Simulation (Simple Check)
log('\nTest 3: Simulation');
// Simulate what GameEngine does
const speaker = mockPlayers[1];
const chatMsg = getAIChat(CHAT_TRIGGERS.ALL_IN, speaker.class.name);
if (chatMsg) {
  mockEventAdaptor.chat({ playerId: speaker.id, message: chatMsg });
} else {
  log('No chat triggered (might be empty or chance based if implemented in engine)');
}
