import { npcMemoryManager } from './src/logic/npcMemoryManager.js';

console.log('--- Testing NPC Memory Manager ---');

// Generate 25 NPCs (exceeding the pool size of 20)
for (let i = 0; i < 25; i++) {
  // Alternate between 'en' and 'ko' to test both
  const locale = i % 2 === 0 ? 'ko' : 'en';
  const npc = npcMemoryManager.generateAndRegisterNPC({ id: 'shark' }, locale);
  console.log(`Generated: ${npc.name} (${npc.id})`);

  // Simulate some interaction to give them different relevance scores
  // First 5 NPCs will have 0 interactions, making them the most likely to be culled
  if (i >= 5) {
    npcMemoryManager.registerInteraction(npc.id, Math.floor(Math.random() * 1000) - 500);
  }
}

const finalPool = npcMemoryManager.getAllNPCs();
console.log(`\nFinal Pool Size (Should be 20): ${finalPool.length}`);

console.log('\nNPCs remaining in pool:');
finalPool.forEach(npc => {
  console.log(`- ${npc.name}: Hands: ${npc.memory.handsPlayed}, Profit: ${npc.memory.netProfitFromPlayer}`);
});

console.log('\nTesting Random Retrieval:');
const randomShark = npcMemoryManager.getRandomExistingNPC('shark');
console.log(`Retrieved random shark: ${randomShark ? randomShark.name : 'None'}`);

console.log('\nTest complete.');
