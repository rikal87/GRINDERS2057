import { getAIChatDialogue } from './src/logic/AIChatSystem.js';
import { npcMemoryManager } from './src/logic/npcMemoryManager.js';
import { CHAT_TRIGGERS } from './src/logic/constants.js';

console.log('--- Testing Context-Aware Dialogue Engine ---');

// 1. Generate an NPC
const npc = npcMemoryManager.generateAndRegisterNPC({ id: 'shark', name: 'Shark' }, 'ko');
console.log(`Generated NPC: ${npc.name} (${npc.id})`);

// Mock player object needed for getAIChatDialogue
const mockPlayer = {
  id: npc.id,
  personaId: 'shark',
  name: npc.name
};

// 2. Test standard fallback (No memory conditions met)
console.log('\n[Test 1] Standard Fallback (No memory)');
let msg = getAIChatDialogue(CHAT_TRIGGERS.GAME_START, mockPlayer);
console.log(`Result: ${msg}`); 

// 3. Test losing a lot of money to the player
console.log('\n[Test 2] Conditional: NPC lost > 1000 chips to player');
npcMemoryManager.registerInteraction(npc.id, -1500);
msg = getAIChatDialogue(CHAT_TRIGGERS.GAME_START, mockPlayer);
console.log(`Result: ${msg}`); // Should print a revenge dialogue

// 4. Test meeting often
console.log('\n[Test 3] Conditional: Meet often (Hands >= 5)');
// reset profit, increase hands
npc.memory.netProfitFromPlayer = 0;
npc.memory.handsPlayed = 5;
msg = getAIChatDialogue(CHAT_TRIGGERS.GAME_START, mockPlayer);
console.log(`Result: ${msg}`); // Should print a "we meet often" dialogue

// 5. Test another trigger (LOSE_HUGE with hands >= 3)
console.log('\n[Test 4] Conditional: LOSE_HUGE with hands >= 3');
msg = getAIChatDialogue(CHAT_TRIGGERS.LOSE_HUGE, mockPlayer);
console.log(`Result: ${msg}`);

console.log('\nTest complete.');
