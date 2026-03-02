
import { store, getEffectiveMaxLT, gainBankroll, TYPE_CHANGE_BANKROLL } from './store';
import { sendMessage } from './messageSystem';
import { AI_TASK_DATA } from './aiAgentTaskData';
import { AI_AGENT_MODEL_ENUM, AI_AGENT_MODEL_AND_PLAN_DATA } from './aiAgentModelClasses';
import { zones } from './zone';
// Task Definitions
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
      gainBankroll(-plan.cost, TYPE_CHANGE_BANKROLL.AI_AGENT_SUBSCRIPTION);
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
  const regenMultiplier = planData.lt_regen_bonus_rate || 1.0;
  const probBonus = planData.probability_bonus || 0;
  const durationBonus = planData.duration_bonus || 0;
  const cooldownBonus = planData.cooldown_bonus || 0;

  // 1. LT Regeneration (1% of max per hour -> 1/60 % per minute)
  const regenAmount = (maxLt * 0.01 * regenMultiplier) / 60;
  store.ludusTokens = Math.min(getEffectiveMaxLT(), store.ludusTokens + regenAmount);

  // 1.5. Process Risk/Penalty (e.g., SECURITY_DETECTION)
  const penaltyTasks = store.onWorkTasks.filter(t => t.status === 'ACTIVE');
  for (const task of penaltyTasks) {
    const td = AI_TASK_DATA.find(x => x.id === task.taskId);
    if (!td || !td.effect) continue;

    const penaltyEffects = td.effect.filter(e => e.type === 'penalty_amount');
    for (const eff of penaltyEffects) {
      const riskChancePerMin = (eff.probability || 0.01) / 60;
      if (Math.random() < riskChancePerMin) {
        triggerRiskDetection(store.onWorkTasks.indexOf(task), eff, td.name);
      }
    }
  }
  // 3. Process Active Tasks
  for (let i = store.onWorkTasks.length - 1; i >= 0; i--) {
    const taskState = store.onWorkTasks[i];
    const taskDef = AI_TASK_DATA.find(t => t.id === taskState.taskId);

    if (!taskDef) {
      store.onWorkTasks.splice(i, 1);
      continue;
    }

    if (taskState.status === 'SEARCHING') {
      if (taskDef.type === 'AGENT_WORK') {
        // AGENT_WORK skips SEARCHING cost and probabilities, goes straight to ACTIVE
        triggerTaskSuccess(taskState, taskDef);
      } else {
        // Normal Tasks Cost Deduction (per hour -> per minute)
        const costPerMin = taskDef.cost / 60;

        if (store.ludusTokens >= costPerMin) {
          store.ludusTokens -= costPerMin;

          // Success Probability scaling (hourly to minutely)
          const adjustedHourlyProb = Math.min(1.0, (taskDef.probability || 0) + probBonus);
          let baseProb = 1 - Math.pow(1 - adjustedHourlyProb, 1 / 60);

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
        } else if (taskDef.cost > 0) {
          sendMessage('SYSTEM', 'Task Paused', `Not enough LT to continue searching for ${taskDef.name}.`);
          store.onWorkTasks.splice(i, 1);
        }
      }
    }
    else if (taskState.status === 'ACTIVE') {
      // Continuous ticking effects during ACTIVE
      if (taskDef.type === 'AGENT_WORK') {
        const costPerMin = taskDef.cost / 60;

        // AGENT_WORK continuously consumes LT while active
        if (store.ludusTokens >= costPerMin) {
          store.ludusTokens -= costPerMin;

          const baseProb = taskDef.probability || 0.1;
          // Check probability per minute based on hourly stated probability
          const probPerMin = 1 - Math.pow(1 - baseProb, 1 / 60);
          if (Math.random() < probPerMin) {
            const bankrollEff = taskDef.effect?.find(e => e.type === 'add_bankroll');
            if (bankrollEff) {
              gainBankroll(bankrollEff.amount, TYPE_CHANGE_BANKROLL.AGENT_TASK);
              sendMessage('SYSTEM', 'Shadow Work Profit', `[${taskDef.name}] Generated ${bankrollEff.amount} CR.`);
            }
          }
        } else {
          sendMessage('SYSTEM', 'Process Terminated', `Not enough LT to sustain ${taskDef.name}. Process aborted.`);
          store.onWorkTasks.splice(i, 1);
          continue;
        }
      } else {
        // Normal Tasks: Check if effect duration has expired
        if (store.gameTime >= taskState.effectEndTime * (1 + durationBonus)) {
          taskState.status = 'COOLDOWN';
          taskState.cooldownEndTime = store.gameTime + (taskDef.cooldown * 60 * 1000) * (1 - (cooldownBonus || 0));
          sendMessage('SYSTEM', 'Effect Expired', `${taskDef.name} effect has ended. Cooldown started.`);

          // Remove active boosts associated with this task
          store.activeBoosts = store.activeBoosts.filter(b => b.taskId !== taskState.taskId);

          if (taskDef.cooldown <= 0) {
            store.onWorkTasks.splice(i, 1);
          }
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

  let actions = [];
  if (taskDef.action) {
    actions.push({
      label: 'ACCEPT',
      actionType: taskDef.action.type,
      payload: taskDef.action
    });
    actions.push({
      label: 'DEL',
      actionType: 'DELETE_MESSAGE',
      payload: {}
    });
  }

  if (taskDef.type === 'AGENT_WORK') {
    sendMessage('SYSTEM', `Task Initialized: ${taskDef.name}`, `The process is now running. Consuming LT continuously.`);
  } else {
    sendMessage('SYSTEM', `Task Success: ${taskDef.name}`, `The task was successful! Effect active for ${taskDef.duration / 60} hours.`, actions);
  }

  // Specific Side Effects
  if (taskDef.risk && taskDef.risk.type === 'SHARK_ATTRACTION') {
    if (Math.random() < (taskDef.risk.chance || 0.1)) {
      sendMessage('SYSTEM', 'Security Alert', `A Shark has noticed your rich prey hunt and might join the table.`);
    }
  }

  // Apply Buff Effects
  if (taskDef.effect && Array.isArray(taskDef.effect)) {
    taskDef.effect.forEach(eff => {
      // Don't add penalty effects to activeBoosts (they are processed minutely)
      if (eff.type === 'penalty_amount') return;

      const boost = { taskId: taskDef.id, effect: { ...eff } };

      // Handle random location for rake discounts
      if (eff.type === 'rake_discount_rnd_mul') {
        zones.forEach(zone => {
          if (zone.id === eff.id) {
            const locations = zone.locations.filter(l => !l.isHidden);
            const locObj = locations[Math.floor(Math.random() * locations.length)];
            boost.effect.targetLocationId = locObj.id;
            // Also notify user about which casino got the discount
            sendMessage('SYSTEM', 'Rake Event Live!', `[${locObj.name}] is now hosting a ${100 - (eff.amount * 100)}% rake discount event for ${taskDef.duration / 24 / 60} days!`);
          }
        });
      }

      store.activeBoosts.push(boost);
    });
  }

};

const triggerRiskDetection = (index, effDef, taskName) => {
  const penalty = effDef.amount || 10000;
  gainBankroll(-penalty, TYPE_CHANGE_BANKROLL.PAY_FINE)
  sendMessage('SYSTEM', 'HACKING DETECTED!', `${taskName} has been terminated by security forces. Penalty: ${penalty.toLocaleString()} CR.`);

  if (index >= 0) {
    const taskState = store.onWorkTasks[index];
    store.activeBoosts = store.activeBoosts.filter(b => b.taskId !== taskState.taskId);
    store.onWorkTasks.splice(index, 1);
  }
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
    case 'cost_lt':
      return store.agentStats.cost_lt_total >= amount;
    case 'completed_task_count':
      return store.agentStats.completed_task_count >= count;
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

  // sendMessage('SYSTEM', 'Task Started', `${taskDef.name} is now in progress...`);
  return true;
};
