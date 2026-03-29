
import { store, getPlayStatsCount, gainBankroll, getCurrentLT, gainLT, getCurrentBankroll, getAgent, getLocalizedText } from './store';
import { sendMessage, MESSAGE_TYPE } from './messageSystem';
import { AI_TASK_DATA, TASK_EFFECT_TYPE } from './aiAgentTaskData';
import { AI_AGENT_MODEL_ENUM, AI_AGENT_MODEL_AND_PLAN_DATA } from './aiAgentModelClasses';
import { zones } from './zone';
import { TYPE_CHANGE_BANKROLL } from './constants.js'
// Task Definitions
// Logic to process tasks every game tick (e.g. hourly)
// Actually we can process minutely, but probability is per hour.
// Let's assume we call this every game hour for simplicity, or scale probability.
// Revised: Call `processAiTasks` every Real Second (Game Minute).
// Probability 10% per hour = ~0.17% per minute.

/**
 * validateTaskSlots: Ensure active tasks fit in the current agent's slots.
 */
export const validateTaskSlots = () => {
  const agent = getAgent();
  if (!agent) {
    if (store.onWorkTasks.length > 0) {
      store.onWorkTasks = []; // Purge all tasks if no agent
    }
    return;
  }
  const planData = agent.model?.price_plan[agent.price_plan_idx] || { slot: ['T1'] };
  const availableSlotsCount = planData.slot.length;

  // If we have more tasks than slots, remove from the bottom (highest index)
  if (store.onWorkTasks.length > availableSlotsCount) {
    sendMessage(MESSAGE_TYPE.SYSTEM, 'Task Slot Overflow', 'Agent downgrade caused task slots to minimize. Excess tasks have been purged.', [], 'System', 24 * 60);
    store.onWorkTasks = store.onWorkTasks.slice(0, availableSlotsCount);
  }
};

/**
 * processAiTasks: Should be called every game minute.
 */
export const processAiTasks = () => {
  // 1. Subscription Lifecycle Check (DEPRECATED: Permanent Upgrade System)
  // checkSubscription();

  // Update HUD Active status
  store.isActiveHud = !!store.activeBoosts.find(b => b.effect.type === TASK_EFFECT_TYPE.HUD_ACTIVE);
  store.isActiveHandHud = !!store.activeBoosts.find(b => b.effect.type === TASK_EFFECT_TYPE.HAND_HUD_ACTIVE);
  store.isActiveSuspicionHud = !!store.activeBoosts.find(b => b.effect.type === TASK_EFFECT_TYPE.SUSPICION_HUD_ACTIVE);

  // Use model/plan data from store
  const agent = store.aiAgent;
  if (!agent) {
    return;
  }
  const modelId = agent.name;
  const planIdx = store.aiAgentTiers[modelId] || 0;
  const planData = AI_AGENT_MODEL_AND_PLAN_DATA[modelId]?.price_plan[planIdx] || { maxLt: 100 };
  const maxLt = planData.maxLt;
  const regenMultiplier = planData.lt_regen_bonus_rate || 1.0;
  const probBonus = planData.probability_bonus || 0;
  const durationBonus = planData.duration_bonus || 0;
  const cooldownBonus = planData.cooldown_bonus || 0;

  // 1. LT Regeneration (1% of max per hour -> 1/60 % per minute)
  const regenAmount = (maxLt * 0.01 * regenMultiplier) / 60;
  // store.ludusTokens = Math.min(getEffectiveMaxLT(), store.ludusTokens + regenAmount);
  gainLT(regenAmount)

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

        if (getCurrentLT() >= costPerMin) {
          // store.ludusTokens -= costPerMin;
          gainLT(-costPerMin);
          // play
          // Success Probability scaling (hourly to minutely)
          const adjustedHourlyProb = Math.min(1.0, (taskDef.probability || 0) + probBonus);
          let baseProb = 1 - Math.pow(1 - adjustedHourlyProb, 1 / 60);

          // Bad Luck Protection (+1% of base probability per failure minute)
          const blpBonus = (taskState.failureCount || 0) * (baseProb * 0.01);
          const currentProb = baseProb + blpBonus;

          if (Math.random() < currentProb) {
            triggerTaskSuccess(taskState, taskDef);
            // DO NOT SPLICE here! The task must remain in onWorkTasks so its ACTIVE duration and COOLDOWN can be tracked.
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
          sendMessage(MESSAGE_TYPE.SYSTEM, 'Task Paused', `Not enough LT to continue searching for ${taskDef.name}.`, [], 'System', 24 * 60);
          store.onWorkTasks.splice(i, 1);
        }
      }
    }
    else if (taskState.status === 'ACTIVE') {
      // Continuous ticking effects during ACTIVE
      if (taskDef.type === 'AGENT_WORK') {
        const costPerMin = taskDef.cost / 60;

        // AGENT_WORK continuously consumes LT while active
        if (getCurrentLT() >= costPerMin) {
          // store.ludusTokens -= costPerMin;
          gainLT(-costPerMin)
          const baseProb = taskDef.probability || 0.1;
          // Check probability per minute based on hourly stated probability
          const probPerMin = 1 - Math.pow(1 - baseProb, 1 / 60);
          if (Math.random() < probPerMin) {
            const bankrollEff = taskDef.effect?.find(e => e.type === 'add_bankroll');
            if (bankrollEff) {
              let finalAmount = bankrollEff.amount;
              if (bankrollEff.maxMultiple && bankrollEff.maxMultiple > 1) {
                const min = bankrollEff.amount;
                const max = bankrollEff.amount * bankrollEff.maxMultiple;
                finalAmount = Math.floor(Math.random() * (max - min + 1)) + min;
              }
              gainBankroll(finalAmount, TYPE_CHANGE_BANKROLL.AGENT_TASK);
              sendMessage(MESSAGE_TYPE.REWARD, 'Agent Work Profit', `[${taskDef.name}] Generated ${finalAmount.toLocaleString()} CR.`, [], 'System', 60);
            }
          }
        } else {
          sendMessage(MESSAGE_TYPE.SYSTEM, 'Process Terminated', `Not enough LT to sustain ${taskDef.name}. Process aborted.`, [], 'System', 24 * 60);

          if (taskDef.cooldown > 0) {
            taskState.status = 'COOLDOWN';
            taskState.cooldownEndTime = store.gameTime + (taskDef.cooldown * 60 * 1000) * (1 - (cooldownBonus || 0));
          } else {
            store.onWorkTasks.splice(i, 1);
          }
          continue;
        }
      } else {
        // Normal Tasks: Check if effect duration has expired
        if (store.gameTime >= taskState.effectEndTime * (1 + durationBonus)) {
          taskState.status = 'COOLDOWN';
          taskState.cooldownEndTime = store.gameTime + (taskDef.cooldown * 60 * 1000) * (1 - (cooldownBonus || 0));
          sendMessage(MESSAGE_TYPE.SYSTEM, 'Effect Expired', `${taskDef.name} effect has ended. Cooldown started.`, [], 'System', 24 * 60);

          // Remove active boosts associated with this task
          // Remove active boosts associated with this task instance
          store.activeBoosts = store.activeBoosts.filter(b => b.instanceId !== taskState.instanceId);

          if (taskDef.cooldown <= 0) {
            store.onWorkTasks.splice(i, 1);
          }
        }
      }
    }
    else if (taskState.status === 'COOLDOWN') {
      if (store.gameTime >= taskState.cooldownEndTime) {
        sendMessage(MESSAGE_TYPE.SYSTEM, 'Task Ready', `${taskDef.name} is now available.`, [], 'System', 24 * 60);
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
    sendMessage(MESSAGE_TYPE.SYSTEM, `Task Initialized: ${taskDef.name}`, `The process is now running. Consuming LT continuously.`, [], 'System', 1 * 60);
  } else {
    sendMessage(MESSAGE_TYPE.SYSTEM, `Task Success: ${taskDef.name}`, `The task was successful! Effect active for ${taskDef.duration / 60} hours.`, actions, 'System', 1 * 60);
  }

  // Apply Buff Effects
  if (taskDef.effect && Array.isArray(taskDef.effect)) {
    taskDef.effect.forEach(eff => {
      // Don't add penalty effects to activeBoosts (they are processed minutely)
      if (eff.type === 'penalty_amount') return;

      if (eff.type === TASK_EFFECT_TYPE.IDENTITY_FORGERY) {
        let maxLocationId = null;
        let maxSuspicion = -1;
        for (const [locId, status] of Object.entries(store.status_zone)) {
          if (status.suspicion > maxSuspicion) {
            maxSuspicion = status.suspicion;
            maxLocationId = locId;
          }
        }
        if (maxLocationId && maxSuspicion > 0) {
          const discount = eff.amount || 0.5;
          store.status_zone[maxLocationId].suspicion = Math.floor(store.status_zone[maxLocationId].suspicion * (1 - discount));
          store.status_zone[maxLocationId].infamy = Math.floor(store.status_zone[maxLocationId].infamy * (1 - discount));
          if (store.status_zone[maxLocationId].suspicion < 100) {
            store.status_zone[maxLocationId].isBlacklisted = false;
          }
          let locName = maxLocationId;
          for (const zone of zones) {
            const loc = zone.locations.find(l => l.id === maxLocationId);
            if (loc) {
              locName = getLocalizedText(loc, 'name');
              break;
            }
          }
          sendMessage(MESSAGE_TYPE.SYSTEM, 'Identity Forged', `Suspicion and Infamy in [${locName}] have been reduced by ${discount * 100}%.`);
        } else {
          sendMessage(MESSAGE_TYPE.SYSTEM, 'Identity Forged', `You already have spotless records everywhere. No suspicion to clear!`);
        }
        return; // Do not add to active boosts
      }

      const boost = { taskId: taskDef.id, instanceId: taskState.instanceId, effect: { ...eff } };

      // Handle random location for rake discounts
      if (eff.type === 'rake_discount_rnd_mul') {
        zones.forEach(zone => {
          if (zone.id === eff.id) {
            const locations = zone.locations.filter(l => !l.isHidden);
            const locObj = locations[Math.floor(Math.random() * locations.length)];
            boost.effect.targetLocationId = locObj.id;
            // Also notify user about which casino got the discount
            console.log(locObj, locObj.name_en, locObj.name_ko);
            sendMessage(MESSAGE_TYPE.EVENT, 'Rake Event Live!', `[${getLocalizedText(locObj, 'name')}] is now hosting a ${100 - (eff.amount * 100)}% rake discount event for ${taskDef.duration / 24 / 60} days!`);
          }
        });
      }

      store.activeBoosts.push(boost);
    });
  }

};

const triggerRiskDetection = (index, effDef, taskName) => {
  const penalty = effDef.amount || 10000;
  // gainBankroll(-penalty, TYPE_CHANGE_BANKROLL.PAY_FINE)
  sendMessage(MESSAGE_TYPE.FINANCE, 'HACKING DETECTED!', `${taskName} has been terminated by security forces.`, [], 'System');

  if (index >= 0) {
    const taskState = store.onWorkTasks[index];
    store.activeBoosts = store.activeBoosts.filter(b => b.instanceId !== taskState.instanceId);

    const taskDef = AI_TASK_DATA.find(t => t.id === taskState.taskId);
    if (taskDef && taskDef.cooldown > 0) {
      const agent = store.aiAgent;
      const modelId = agent.name;
      const planIdx = store.aiAgentTiers[modelId] || 0;
      const planData = AI_AGENT_MODEL_AND_PLAN_DATA[modelId]?.price_plan[planIdx];
      const cooldownBonus = planData?.cooldown_bonus || 0;

      taskState.status = 'COOLDOWN';
      taskState.cooldownEndTime = store.gameTime + (taskDef.cooldown * 60 * 1000) * (1 - cooldownBonus);
    } else {
      store.onWorkTasks.splice(index, 1);
    }
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
  switch (type) {
    default: return getPlayStatsCount(type) >= (amount || count);
  }
};

export const startTask = (taskId) => {
  const taskDef = AI_TASK_DATA.find(t => t.id === taskId);
  if (!taskDef) return false;



  // Check Max Slots and Compatibility
  const agent = store.aiAgent;
  if (!agent) {
    sendMessage(MESSAGE_TYPE.SYSTEM, 'System Offline', 'Please boot your AI Agent before starting tasks.', [], 'System', 24 * 60);
    return false;
  }
  const modelId = agent.name;
  const planIdx = store.aiAgentTiers[modelId] || 0;
  const planData = AI_AGENT_MODEL_AND_PLAN_DATA[modelId]?.price_plan[planIdx] || { slot: ['T1'] };
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
    sendMessage(MESSAGE_TYPE.SYSTEM, 'Memory Error', `No compatible free Task slot for Tier ${taskDef.tier} task.`, [], 'System', 24 * 60);
    return false;
  }

  // Handle Lump Sum Costs
  if (taskDef.isLumpSum) {
    if (store.ludusTokens < taskDef.cost) {
      sendMessage(MESSAGE_TYPE.SYSTEM, 'Not Enough LT', `Required: ${taskDef.cost} LT`, [], 'System', 24 * 60);
      return false;
    }
    store.ludusTokens -= taskDef.cost;

    // Instant trigger
    const newTaskState = {
      taskId,
      instanceId: store.gameTime + "_" + Math.random().toString(36).substr(2, 5),
      status: 'WORKING',
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
    instanceId: store.gameTime + "_" + Math.random().toString(36).substr(2, 5),
    status: 'SEARCHING',
    startTime: store.gameTime,
    slotIndex: foundSlotIdx,
    failureCount: 0
  });

  // sendMessage('SYSTEM', 'Task Started', `${taskDef.name} is now in progress...`);
  return true;
};

/**
 * upgradeAgentModel: Sequential upgrade for a specific model.
 */
export const upgradeAgentModel = (modelId) => {
  const currentTier = store.aiAgentTiers[modelId];
  if (currentTier === undefined) return false;

  const modelData = AI_AGENT_MODEL_AND_PLAN_DATA[modelId];
  const nextTier = currentTier + 1;
  const nextPlan = modelData.price_plan[nextTier];

  if (!nextPlan) {
    sendMessage(MESSAGE_TYPE.SYSTEM, 'Max Upgrade', `${modelId} is already at its maximum potential.`, [], 'System', 60);
    return false;
  }

  if (getCurrentBankroll() < nextPlan.cost) {
    sendMessage(MESSAGE_TYPE.FINANCE, 'Insufficient Funds', `Need ${nextPlan.cost} CR to upgrade ${modelId}.`, [], 'System', 60);
    return false;
  }

  // Deduct cost and upgrade
  gainBankroll(-nextPlan.cost, TYPE_CHANGE_BANKROLL.AI_AGENT_UPGRADE);
  store.aiAgentTiers[modelId] = nextTier;

  // If this is the active agent, update its reference (optional since we read from tiers, but good for internal consistency)
  if (store.aiAgent && store.aiAgent.name === modelId) {
    store.aiAgent.price_plan_idx = nextTier;
  }

  sendMessage(MESSAGE_TYPE.SYSTEM, 'System Upgrade Complete', `${modelId} has been upgraded to Tier ${nextTier}.`, [], 'System', 24 * 60);
  return true;
};

/**
 * switchAgentModel: Switch active model while preserving tiers.
 */
export const switchAgentModel = (modelId) => {
  const modelData = AI_AGENT_MODEL_AND_PLAN_DATA[modelId];
  if (!modelData) return false;

  const tier = store.aiAgentTiers[modelId] || 0;

  store.aiAgent = {
    name: modelId,
    model: modelData,
    price_plan_idx: tier,
    subscriptionExpireAt: 0
  };

  sendMessage(MESSAGE_TYPE.SYSTEM, 'Agent Switched', `Active model set to ${modelId} (Tier ${tier}).`, [], 'System', 24 * 60);

  // Validate tasks after switching to handle slot changes
  validateTaskSlots();
  return true;
};
