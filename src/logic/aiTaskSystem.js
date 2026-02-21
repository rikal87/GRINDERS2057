
import { store, getEffectiveMaxLT } from './store';
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
    constraints: { sb: 5, bb: 10, buyIn: 200 },
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
    cooldown: 3 * 24 * 60, // 3 days,
    unlock: { type: 'Bust_enemy', id: 'fish', count: 25 }
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
    cooldown: 3 * 24 * 60,
    unlock: { type: 'Bust_enemy', id: 'maniac', count: 25 }
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
    cooldown: 0,
    unlock: { type: 'played_hand', count: 100 }
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
    risk: { type: 'SHARK_ATTRACTION', chance: 0.1, 'dev_comment': 'This is a dummy yet.' },
    unlock: { type: 'Bust_enemy', id: 'rich_guy', count: 25 }
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
    constraints: { sb: 50000, bb: 100000, buyIn: 2000000 },
    unlock: { type: 'Bust_enemy', id: 'shark', count: 250 }
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
    cooldown: 3 * 24 * 60,
    unlock: { type: 'paid_rake', amount: 1000000 }
  },
  {
    tier: 5,
    name: 'Invite Shark',
    type: 'BOOST',
    desc: 'Always following a [Shark] to your joined table.',
    costPerTime: 10,
    probability: 0.1,
    cooldown: 10 * 24 * 60,
    duration: 24 * 60,
    unlock: { type: 'Bust_enemy', id: 'shark', count: 25 }
  },
  {
    tier: 5,
    name: 'A bunch of Vagabond',
    type: 'BOOST',
    desc: 'Always following a [BROKE] x3 to your joined table.',
    costPerTime: 20,
    probability: 0.1,
    cooldown: 5 * 24 * 60,
    duration: 1 * 24 * 60,
    unlock: { type: 'Bust_enemy', id: 'broke', count: 125 }
  },
  {
    tier: 6,
    name: 'Become Legend',
    type: 'BOOST',
    desc: 'Always following a [Named_Pro] to your joined table.',
    costPerTime: 50,
    probability: 0.1,
    cooldown: 7 * 24 * 60,
    duration: 1 * 24 * 60,
    unlock: { type: 'Bust_enemy', id: 'named_pro', count: 50 }
  },
  {
    tier: 6,
    name: 'Orbit Network hacking',
    type: 'NETWORKING',
    desc: 'You can join [The Orbit] table. (Only at once)',
    costPerTime: 50,
    probability: 0.05,
    cooldown: 10 * 24 * 60,
    duration: 1 * 24 * 60,
    unlock: { type: 'reach_credit', credit: 100000000000 }
  },

  // Add more from spec...
];

// Logic to process tasks every game tick (e.g. hourly)
// Actually we can process minutely, but probability is per hour.
// Let's assume we call this every game hour for simplicity, or scale probability.
// Revised: Call `processAiTasks` every Real Second (Game Minute).
// Probability 10% per hour = ~0.17% per minute.

/**
 * checkSubscription: Handle AI Agent subscription expiration and auto-renewal.
 */
export const checkSubscription = () => {
  const agent = store.aiAgent;
  if (store.gameTime < agent.subscriptionExpireAt) return; // Not expired yet

  // If expired or not set (0), try to renew
  const modelId = agent.name;
  const planIdx = agent.price_plan_idx;
  const modelData = AI_AGENT_MODEL_AND_PLAN_DATA[modelId];
  const plan = modelData?.price_plan[planIdx];

  if (plan && plan.cost > 0) {
    if (store.bankroll >= plan.cost) {
      // Auto-renew for 30 days
      store.bankroll -= plan.cost;
      // 30 days in ms = 30 * 24 * 60 * 60 * 1000
      const duration = 30 * 24 * 60 * 60 * 1000;
      agent.subscriptionExpireAt = store.gameTime + duration;

      sendMessage('SYSTEM', 'Subscription Renewed', `${modelId} [${planIdx}] has been auto-renewed for 30 days.`);
      return;
    } else {
      // Insufficient funds -> Fallback to Vanguard Free
      sendMessage('SYSTEM', 'Subscription Expired', `Insufficient funds to renew ${modelId}. Systems downgraded to VANGUARD [FREE].`);

      agent.name = AI_AGENT_MODEL_ENUM.VANGUARD;
      agent.model = AI_AGENT_MODEL_AND_PLAN_DATA[AI_AGENT_MODEL_ENUM.VANGUARD];
      agent.price_plan_idx = 0;
      agent.subscriptionExpireAt = 0;

      // Handle task constraints
      validateTaskSlots();
    }
  }
};

/**
 * validateTaskSlots: Ensure active tasks fit in the current agent's slots.
 */
export const validateTaskSlots = () => {
  const agent = store.aiAgent;
  const planData = agent.model?.price_plan[agent.price_plan_idx] || { slot: ['T1'] };
  const availableSlotsCount = planData.slot.length;

  // If we have more tasks than slots, remove from the bottom (highest index)
  if (store.onWorkTasks.length > availableSlotsCount) {
    sendMessage('SYSTEM', 'Task Slot Overflow', 'Agent downgrade caused task slots to minimize. Excess tasks have been purged.');
    store.onWorkTasks = store.onWorkTasks.slice(0, availableSlotsCount);
  }
};

/**
 * processAiTasks: Should be called every game minute.
 */
export const processAiTasks = () => {
  // 1. Subscription Lifecycle Check
  checkSubscription();

  // Use model/plan data from store
  const agent = store.aiAgent;
  const planIdx = agent.price_plan_idx;
  const planData = agent.model?.price_plan[planIdx] || { maxLt: 100 };
  const maxLt = planData.maxLt;

  // 1. LT Regeneration (1% of max per hour -> 1/60 % per minute)
  const regenAmount = maxLt * 0.01 / 60;
  store.ludusTokens = Math.min(getEffectiveMaxLT(), store.ludusTokens + regenAmount);

  // 3. Process Active Tasks
  for (let i = store.onWorkTasks.length - 1; i >= 0; i--) {
    const taskState = store.onWorkTasks[i];
    const taskDef = AI_TASK_DATA.find(t => t.id === taskState.taskId);

    if (!taskDef) {
      store.onWorkTasks.splice(i, 1);
      continue;
    }

    if (taskState.status === 'SEARCHING') {
      // Cost Deduction (per hour -> per minute)
      const costPerMin = taskDef.costPerTime / 60;

      if (store.ludusTokens >= costPerMin) {
        store.ludusTokens -= costPerMin;

        // Success Probability scaling (hourly to minutely)
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
            const riskChancePerMin = (taskDef.risk.probability || 0.01) / 60;
            if (Math.random() < riskChancePerMin) {
              triggerRiskDetection(i, taskDef);
            }
          }
        }
      } else {
        sendMessage('SYSTEM', 'Task Paused', `Not enough LT to continue ${taskDef.name}.`);
        store.onWorkTasks.splice(i, 1);
      }
    }
    else if (taskState.status === 'ACTIVE') {
      // Ticking duration
      if (store.gameTime >= taskState.effectEndTime) {
        taskState.status = 'COOLDOWN';
        taskState.cooldownEndTime = store.gameTime + (taskDef.cooldown * 60 * 1000);
        sendMessage('SYSTEM', 'Effect Expired', `${taskDef.name} effect has ended. Cooldown started.`);

        if (taskDef.cooldown <= 0) {
          store.onWorkTasks.splice(i, 1);
        }
      }
    }
    else if (taskState.status === 'COOLDOWN') {
      if (store.gameTime >= taskState.cooldownEndTime) {
        sendMessage('SYSTEM', 'Skill Ready', `${taskDef.name} is now available.`);
        store.onWorkTasks.splice(i, 1);
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
  store.onWorkTasks.splice(index, 1);
};

const canTaskFitInSlot = (taskTier, slotType) => {
  // Extract number from 'T1', 'T2', etc. (Slot Tier must be >= Task Tier)
  const slotTier = parseInt(slotType.substring(1));
  if (taskTier <= slotTier) return true;
  return false;
};

/**
 * isTaskUnlocked: Check if a task's unlock requirements have been met.
 */
export const isTaskUnlocked = (taskDef) => {
  if (!taskDef.unlock) return true; // No requirement, implicitly unlocked

  const { type, count, id, amount, credit } = taskDef.unlock;
  const stats = store.play_stats;

  switch (type) {
    case 'Bust_enemy':
      // Map task ID to stats persona name if necessary
      const personaKey = id.charAt(0).toUpperCase() + id.slice(1);
      return (stats.bust_enemy[personaKey] || 0) >= count;

    case 'played_hand':
      return stats.played_hands >= count;

    case 'paid_rake':
      return stats.paid_rake >= amount;

    case 'reach_credit':
      // Check current bankroll or total earned? credit usually refers to bankroll
      return store.bankroll >= credit;

    default:
      console.warn(`Unknown unlock type: ${type}`);
      return true;
  }
};

export const startTask = (taskId) => {
  const taskDef = AI_TASK_DATA.find(t => t.id === taskId);
  if (!taskDef) return false;

  // Check if already active in any status
  if (store.onWorkTasks.find(t => t.taskId === taskId)) {
    sendMessage('SYSTEM', 'Already Active', `${taskDef.name} is already running or in cooldown.`);
    return false;
  }

  // Check Max Slots and Compatibility
  const agent = store.aiAgent;
  const planData = agent.model?.price_plan[agent.price_plan_idx] || { slot: ['T1'] };
  const availableSlots = planData.slot;

  // Identify occupied slot indices
  const occupiedSlotIndices = store.onWorkTasks
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
    store.onWorkTasks.push(newTaskState);
    triggerTaskSuccess(newTaskState, taskDef);
    return true;
  }

  // Standard Task
  store.onWorkTasks.push({
    taskId,
    status: 'SEARCHING',
    startTime: store.gameTime,
    slotIndex: foundSlotIdx,
    failureCount: 0
  });

  sendMessage('SYSTEM', 'Task Started', `${taskDef.name} is now in progress...`);
  return true;
};
