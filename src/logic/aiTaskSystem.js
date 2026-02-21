
import { store } from './store';
import { sendMessage } from './messageSystem';
import { AI_AGENT_MODEL_ENUM, AI_AGENT_MODEL_AND_PLAN_DATA } from './aiAgentModelClasses';
// Task Definitions
export const AI_TASK_DATA = [
  {
    id: 'neighborhood_game',
    tier: 1,
    name: 'Neighborhood Game',
    type: 'NETWORKING',
    desc: 'Host a rake-free home game with local fish.\n(RAKE 0% / SB 5 / BB 10 / base buy-in 200BB)',
    costPerTime: 1, // LT per hour
    probability: 0.1, // 10% per hour
    duration: 4 * 60, // 4 hours in minutes
    cooldown: 3 * 24 * 60, // 3 days in minutes
    persona_pools: ['Fish', 'Broke', 'MR_CALL'],
    constraints: { sb: 5, bb: 10, buyIn: 200 }
  },
  {
    id: 'fish_finder',
    tier: 2,
    name: 'Fish Finder',
    type: 'SEARCHING',
    desc: 'Increase [Fish] persona spawn rate by 2x.',
    costPerTime: 3,
    probability: 0.1,
    duration: 24 * 60, // 1 day
    cooldown: 3 * 24 * 60 // 3 days
  },
  {
    id: 'maniac_attractor',
    tier: 2,
    name: 'Maniac Attractor',
    type: 'SEARCHING',
    desc: 'Increase [Maniac] persona spawn rate by 3x.',
    costPerTime: 4,
    probability: 0.1,
    duration: 24 * 60,
    cooldown: 3 * 24 * 60
  },
  {
    id: 'grinders_mindset',
    tier: 2,
    name: "Grinder's Mindset",
    type: 'BOOST',
    desc: 'Increase XP gain by 25%.',
    isLumpSum: true,
    cost: 50, // One-time LT
    probability: 1.0, // Instant
    duration: 24 * 60,
    cooldown: 0
  },
  {
    id: 'rich_guy_hunter',
    tier: 3,
    name: 'Rich Guy Hunter',
    type: 'SEARCHING',
    desc: 'Increase [Rich_Guy] persona spawn rate by 3x. 10% chance to attract a Shark.',
    costPerTime: 8,
    probability: 0.1,
    duration: 24 * 60,
    cooldown: 10 * 24 * 60,
    risk: { type: 'SHARK_ATTRACTION', chance: 0.1, 'dev_comment': 'This is a dummy yet.' }
  },
  {
    id: 'hand_history_mining',
    tier: 3,
    name: 'Hand History Mining',
    type: 'INFO',
    desc: 'Permanently save hand history and show detailed HUD stats.',
    isLumpSum: true,
    cost: 50,
    probability: 1.0,
    duration: 24 * 60,
    cooldown: 0
  },
  {
    id: 'orbit_network_hack',
    tier: 6,
    name: 'Orbit Network Hack',
    type: 'HACKING',
    desc: 'You can join [The Orbit] table. (Only at once)',
    costPerTime: 100,
    probability: 0.05,
    duration: 24 * 60,
    cooldown: 20 * 24 * 60,
    risk: { type: 'SECURITY_DETECTION', probability: 0.01, penalty: 100000, 'dev_comment': 'This is a dummy yet.' }
  },
  {
    id: 'shark_cage',
    tier: 5,
    name: "Shark's Cage",
    type: 'NETWORKING',
    desc: "Host a high-roller game with sharks.\n(Rake 0% / SB 50k / BB 100k / base buy-in 2M)",
    costPerTime: 100,
    probability: 0.05,
    duration: 24 * 60,
    cooldown: 20 * 24 * 60,
    persona_pools: ['Shark'],
    constraints: { sb: 50000, bb: 100000, buyIn: 2000000 }
  },
  {
    id: 'house_always_wins',
    tier: 6,
    name: "The 'House' Always Wins?",
    type: 'HACKING',
    desc: 'Manipulate the system to pay 0% rake.',
    costPerTime: 100,
    probability: 0.05,
    duration: 24 * 60,
    cooldown: 3 * 24 * 60
  },
  {
    tier: 5,
    name: 'Invite Shark',
    type: 'BOOST',
    desc: 'Always following a [Shark] to your joined table.',
    costPerTime: 10,
    probability: 0.1,
    cooldown: 10 * 24 * 60,
    duration: 24 * 60
  },
  {
    tier: 5,
    name: 'A bunch of Vagabond',
    type: 'BOOST',
    desc: 'Always following a [BROKE] x3 to your joined table.',
    costPerTime: 20,
    probability: 0.1,
    cooldown: 5 * 24 * 60,
    duration: 1 * 24 * 60
  },
  {
    tier: 6,
    name: 'Become Legend',
    type: 'BOOST',
    desc: 'Always following a [Named_Pro] to your joined table.',
    costPerTime: 50,
    probability: 0.1,
    cooldown: 7 * 24 * 60,
    duration: 1 * 24 * 60
  },
  {
    tier: 6,
    name: 'Orbit Network hacking',
    type: 'NETWORKING',
    desc: 'You can join [The Orbit] table. (Only at once)',
    costPerTime: 50,
    probability: 0.05,
    cooldown: 10 * 24 * 60,
    duration: 1 * 24 * 60
  },

  // Add more from spec...
];

// Logic to process tasks every game tick (e.g. hourly)
// Actually we can process minutely, but probability is per hour.
// Let's assume we call this every game hour for simplicity, or scale probability.
// Revised: Call `processAiTasks` every Real Second (Game Minute).
// Probability 10% per hour = ~0.17% per minute.

/**
 * processAiTasks: Should be called every game minute.
 */
export const processAiTasks = () => {
  // Use model/plan data from store
  const modelId = store.aiAgent.model;
  const planIdx = store.aiAgent.tier; // Use tier as index into price_plan
  const modelData = AI_AGENT_MODEL_AND_PLAN_DATA[modelId];
  const planData = modelData?.price_plan[planIdx] || { maxLt: 100 };
  const maxLt = planData.maxLt;

  // 1. LT Regeneration (1% of max per hour -> 1/60 % per minute)
  const regenAmount = maxLt * 0.01 / 60;
  store.ludusTokens = Math.min(maxLt, store.ludusTokens + regenAmount);

  // 2. Process Active Tasks
  for (let i = store.aiAgent.activeTasks.length - 1; i >= 0; i--) {
    const taskState = store.aiAgent.activeTasks[i];
    const taskDef = AI_TASK_DATA.find(t => t.id === taskState.taskId);

    if (!taskDef) {
      store.aiAgent.activeTasks.splice(i, 1);
      continue;
    }

    if (taskState.status === 'SEARCHING') {
      // Cost Deduction (per hour -> per minute)
      const costPerMin = taskDef.costPerTime / 60;

      if (store.ludusTokens >= costPerMin) {
        store.ludusTokens -= costPerMin;

        // Success Probability scaling (hourly to minutely)
        // P_min = 1 - (1 - P_hr)^(1/60)
        let baseProb = 1 - Math.pow(1 - taskDef.probability, 1 / 60);

        // Bad Luck Protection (+1% of base probability per failure minute)
        const blpBonus = (taskState.failureCount || 0) * (baseProb * 0.01);
        const currentProb = baseProb + blpBonus;

        if (Math.random() < currentProb) {
          triggerTaskSuccess(taskState, taskDef);
        } else {
          taskState.failureCount = (taskState.failureCount || 0) + 1;

          // Risk Check (Detection risk)
          if (taskDef.risk && taskDef.risk.type === 'SECURITY_DETECTION') {
            const riskChancePerMin = taskDef.risk.chancePerMin || 0.0001; // Default low risk per min
            if (Math.random() < riskChancePerMin) {
              triggerRiskDetection(i, taskDef);
            }
          }
        }
      } else {
        sendMessage('SYSTEM', 'Task Paused', `Not enough LT to continue ${taskDef.name}.`);
        store.aiAgent.activeTasks.splice(i, 1);
      }
    }
    else if (taskState.status === 'ACTIVE') {
      // Ticking duration
      if (store.gameTime >= taskState.effectEndTime) {
        taskState.status = 'COOLDOWN';
        taskState.cooldownEndTime = store.gameTime + (taskDef.cooldown * 60 * 1000); // cooldown is in minutes
        sendMessage('SYSTEM', 'Effect Expired', `${taskDef.name} effect has ended. Cooldown started.`);

        // If cooldown is 0, just remove it
        if (taskDef.cooldown <= 0) {
          store.aiAgent.activeTasks.splice(i, 1);
        }
      }
    }
    else if (taskState.status === 'COOLDOWN') {
      if (store.gameTime >= taskState.cooldownEndTime) {
        sendMessage('SYSTEM', 'Skill Ready', `${taskDef.name} is now available.`);
        store.aiAgent.activeTasks.splice(i, 1);
      }
    }
  }
};

const triggerTaskSuccess = (taskState, taskDef) => {
  taskState.status = 'ACTIVE';
  taskState.effectEndTime = store.gameTime + (taskDef.duration * 60 * 1000); // duration is in minutes
  taskState.failureCount = 0;

  sendMessage('SYSTEM', `Task Success: ${taskDef.name}`, `The task was successful! Effect active for ${taskDef.duration / 60} hours.`);

  // Specific Side Effects
  if (taskDef.risk && taskDef.risk.type === 'SHARK_ATTRACTION') {
    if (Math.random() < (taskDef.risk.chance || 0.1)) {
      sendMessage('SYSTEM', 'Security Alert', `A Shark has noticed your rich prey hunt and might join the table.`);
    }
  }
};

const triggerRiskDetection = (index, taskDef) => {
  const penalty = taskDef.risk.penalty || 10000;
  store.bankroll = Math.max(0, store.bankroll - penalty);
  sendMessage('SYSTEM', 'HACKING DETECTED!', `Security forces located your signal. Penalty: ${penalty.toLocaleString()} CR.`);
  store.aiAgent.activeTasks.splice(index, 1);
};

const canTaskFitInSlot = (taskTier, slotType) => {
  // Extract number from 'T1', 'T2', etc. (Slot Tier must be >= Task Tier)
  const slotTier = parseInt(slotType.substring(1));
  if (taskTier <= slotTier) return true;
  return false;
};

export const startTask = (taskId) => {
  const taskDef = AI_TASK_DATA.find(t => t.id === taskId);
  if (!taskDef) return false;

  // Check if already active in any status
  if (store.aiAgent.activeTasks.find(t => t.taskId === taskId)) {
    sendMessage('SYSTEM', 'Already Active', `${taskDef.name} is already running or in cooldown.`);
    return false;
  }

  // Check Max Slots and Compatibility
  const modelId = store.aiAgent.model;
  const planIdx = store.aiAgent.tier;
  const modelData = AI_AGENT_MODEL_AND_PLAN_DATA[modelId];
  const planData = modelData?.price_plan[planIdx] || { slot: ['T1'] };
  const availableSlots = planData.slot;

  // Identify occupied slot indices
  const occupiedSlotIndices = store.aiAgent.activeTasks
    .filter(t => t.status !== 'COOLDOWN')
    .map(t => t.slotIndex);

  // Find a suitable empty slot
  let foundSlotIdx = -1;
  for (let i = 0; i < availableSlots.length; i++) {
    if (!occupiedSlotIndices.includes(i)) {
      if (canTaskFitInSlot(taskDef.tier, availableSlots[i])) {
        foundSlotIdx = i;
        break;
      }
    }
  }

  if (foundSlotIdx === -1) {
    sendMessage('SYSTEM', 'Memory Error', `No compatible free memory slot for Tier ${taskDef.tier} task.`);
    return false;
  }

  // Handle Lump Sum Costs
  if (taskDef.isLumpSum) {
    if (store.ludusTokens < taskDef.cost) {
      sendMessage('SYSTEM', 'Not Enough LT', `Required: ${taskDef.cost} LT`);
      return false;
    }
    store.ludusTokens -= taskDef.cost;

    // Instant trigger
    const newTaskState = {
      taskId,
      status: 'SEARCHING',
      startTime: store.gameTime,
      slotIndex: foundSlotIdx,
      failureCount: 0
    };
    store.aiAgent.activeTasks.push(newTaskState);
    triggerTaskSuccess(newTaskState, taskDef);
    return true;
  }

  // Standard Task
  store.aiAgent.activeTasks.push({
    taskId,
    status: 'SEARCHING',
    startTime: store.gameTime,
    slotIndex: foundSlotIdx,
    failureCount: 0
  });

  sendMessage('SYSTEM', 'Task Started', `${taskDef.name} is now in progress...`);
  return true;
};
