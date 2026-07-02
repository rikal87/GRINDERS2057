import { generateUniqueName } from './npcNameTable.js';

class NPCMemoryManager {
  constructor() {
    this.maxPoolSize = 20;
    // Map to maintain insertion order which is useful for basic LRU/Activity tracking,
    // though we will use custom logic to cull the least relevant NPCs.
    // Key: id, Value: npcData
    this.activeNPCs = new Map();
  }

  /**
   * Clears the memory (e.g. on game reset)
   */
  reset() {
    this.activeNPCs.clear();
  }

  /**
   * Retrieves an NPC by ID.
   */
  getNPC(id) {
    return this.activeNPCs.get(id);
  }

  /**
   * Generates a new named NPC from a base template, adding it to the memory pool.
   * If the pool is at capacity, it culls the least relevant NPC first.
   * @param {Object} baseTemplate - The persona template
   * @param {string} locale - 'en' or 'ko' (defaults to 'en')
   * @returns {Object} The generated NPC memory object
   */
  generateAndRegisterNPC(baseTemplate, locale = 'en') {
    if (this.activeNPCs.size >= this.maxPoolSize) {
      this.cullLeastRelevantNPC();
    }

    const existingNames = Array.from(this.activeNPCs.values()).map(n => n.name);
    const uniqueName = generateUniqueName(existingNames, locale);
    const id = crypto.randomUUID();

    const npcData = {
      id: id,
      personaId: baseTemplate.id || baseTemplate.personaId,
      name: uniqueName,
      createdAt: Date.now(),
      lastEncounterAt: Date.now(),
      memory: {
        handsPlayed: 0,
        netProfitFromPlayer: 0, // positive means NPC won money from player
        timesBustedByPlayer: 0,
        timesBustedPlayer: 0,
      }
    };

    this.activeNPCs.set(id, npcData);
    return npcData;
  }

  /**
   * Registers a played hand, updating the lastEncounterAt and handsPlayed.
   */
  registerInteraction(id, profitDelta = 0) {
    const npc = this.activeNPCs.get(id);
    if (!npc) return;

    npc.lastEncounterAt = Date.now();
    npc.memory.handsPlayed += 1;
    npc.memory.netProfitFromPlayer += profitDelta;
  }

  /**
   * Registers a bust event.
   */
  registerBust(id, byPlayer = false) {
    const npc = this.activeNPCs.get(id);
    if (!npc) return;

    if (byPlayer) {
      npc.memory.timesBustedByPlayer += 1;
    }
  }

  /**
   * Gets a random existing NPC from the pool, optionally filtering by persona.
   * Used to repopulate tables with people the player has seen before.
   */
  getRandomExistingNPC(personaId = null) {
    let pool = Array.from(this.activeNPCs.values());
    if (personaId) {
      pool = pool.filter(npc => npc.personaId === personaId);
    }
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Culls the least relevant NPC when pool hits max size.
   * Relevance is determined by a score: hands played and absolute profit exchanged.
   */
  cullLeastRelevantNPC() {
    if (this.activeNPCs.size === 0) return;

    let leastRelevantId = null;
    let lowestScore = Infinity;
    let oldestEncounter = Infinity;

    for (const [id, npc] of this.activeNPCs.entries()) {
      // Score = handsPlayed + (Math.abs(netProfit) / 100)
      // Higher score means more relevant (should be kept)
      const score = npc.memory.handsPlayed + (Math.abs(npc.memory.netProfitFromPlayer) / 100);
      
      if (score < lowestScore) {
        lowestScore = score;
        leastRelevantId = id;
        oldestEncounter = npc.lastEncounterAt;
      } else if (score === lowestScore && npc.lastEncounterAt < oldestEncounter) {
        // Tie-breaker: older encounter gets culled first
        leastRelevantId = id;
        oldestEncounter = npc.lastEncounterAt;
      }
    }

    if (leastRelevantId) {
      this.activeNPCs.delete(leastRelevantId);
    }
  }

  // Get all active NPCs (for debugging/saving)
  getAllNPCs() {
    return Array.from(this.activeNPCs.values());
  }
}

export const npcMemoryManager = new NPCMemoryManager();
