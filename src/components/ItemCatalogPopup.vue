<template>
  <transition name="v4-fade">
    <div v-if="show" class="v5-modal-overlay" @click.self="$emit('close')">
      <div class="catalog-modal">
        <div class="catalog-header">
          <h2 class="glitch-text" data-text="ITEM_CATALOG">ITEM_CATALOG</h2>
          <button class="btn-close" @click="$emit('close')">✕</button>
        </div>
        <div class="catalog-body">
          <div v-for="tier in tiers" :key="tier" class="tier-section">
            <div class="tier-label">{{ tier }}</div>
            <div class="items-grid">
              <div v-for="item in getItemsByTier(tier)" :key="item.id" class="item-card"
                :class="{ locked: !isUnlocked(item), unlocked: isUnlocked(item) }"
                @mouseenter="showTooltip($event, item)" @mouseleave="hideTooltip">
                <div class="item-icon" :class="{ 'locked-icon': !isUnlocked(item) }">
                  {{ isUnlocked(item) ? item.icon : '?' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Teleport tooltip to body to avoid overflow clipping -->
  <Teleport to="body">
    <div v-if="tooltip.visible && props.show" class="catalog-tooltip" :class="{ 'lock-tooltip': tooltip.isLocked }"
      :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
      <template v-if="!tooltip.isLocked">
        <div class="tt-name">{{ tooltip.name }}</div>
        <div class="tt-desc">{{ tooltip.desc }}</div>
      </template>
      <template v-else>
        <div class="tt-title">🔒 LOCKED</div>
        <div class="tt-req" v-for="req in tooltip.requirements" :key="req">{{ req }}</div>
      </template>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { ITEM_DATA } from '../logic/items';
import { isItemUnlocked, UNLOCK_RULES } from '../logic/achievementManager';
import { getUnlockAchievements } from '../logic/store';

const props = defineProps({ show: Boolean });

const tiers = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];

const unlockedAchievements = computed(() => getUnlockAchievements());

const getItemsByTier = (tier) =>
  ITEM_DATA.filter(item => item.tier === tier && !item.isAccessKey);

const isUnlocked = (item) =>
  isItemUnlocked(item, unlockedAchievements.value);

// Shared tooltip state
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  name: '',
  desc: '',
  isLocked: false,
  requirements: [],
});

const effectToRuleMap = computed(() => {
  const map = {};
  UNLOCK_RULES.forEach(rule => {
    if (!map[rule.unlockEffectId]) map[rule.unlockEffectId] = [];
    map[rule.unlockEffectId].push(rule);
  });
  Object.values(map).forEach(arr => arr.sort((a, b) => a.maxAllowEffectCount - b.maxAllowEffectCount));
  return map;
});

const getLockRequirements = (item) => {
  if (!item.effects) return [];
  const guardedEffects = new Set(UNLOCK_RULES.map(r => r.unlockEffectId));
  const effectCountMap = {};
  item.effects.forEach(eff => {
    const effectId = typeof eff === 'string' ? eff : eff?.id;
    if (effectId && guardedEffects.has(effectId)) {
      effectCountMap[effectId] = (effectCountMap[effectId] || 0) + 1;
    }
  });
  const requirements = [];
  const currentUnlocked = unlockedAchievements.value;
  for (const [effectId, count] of Object.entries(effectCountMap)) {
    const rules = effectToRuleMap.value[effectId] || [];
    const neededRule = rules.find(r => r.maxAllowEffectCount >= count && !currentUnlocked.includes(r.id));
    if (neededRule) {
      requirements.push(`필요 업적: ${neededRule.id}`);
      requirements.push(`(${neededRule.type}: ${neededRule.value} 필요)`);
    }
  }
  return requirements;
};

const showTooltip = (event, item) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const locked = !isUnlocked(item);

  tooltip.isLocked = locked;
  tooltip.name = item.name;
  tooltip.desc = item.desc;
  tooltip.requirements = locked ? getLockRequirements(item) : [];

  // Position above the card, centered
  const TOOLTIP_W = 200;
  tooltip.x = Math.max(8, Math.min(window.innerWidth - TOOLTIP_W - 8, rect.left + rect.width / 2 - TOOLTIP_W / 2));
  tooltip.y = rect.top - 8; // will be shifted up via transform
  tooltip.visible = true;
};

const hideTooltip = () => {
  tooltip.visible = false;
};
</script>

<style scoped>
.v5-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}
.catalog-modal {
  background: rgba(10, 15, 25, 0.97);
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 12px;
  width: min(90vw, 780px);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.1);
}
.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 240, 255, 0.15);
}
.catalog-header h2 {
  font-size: 1.1rem;
  letter-spacing: 3px;
  color: var(--neon-cyan, #00f0ff);
  margin: 0;
}
.btn-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-close:hover {
  color: var(--neon-cyan, #00f0ff);
}

.catalog-body {
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tier-label {
  font-size: 0.7rem;
  letter-spacing: 2px;
  color: rgba(0, 240, 255, 0.5);
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(0, 240, 255, 0.1);
  padding-bottom: 4px;
}
.items-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.item-card {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  transition: transform 0.15s;
}
.item-card:hover {
  transform: scale(1.1);
}
.item-card.unlocked {
  background: rgba(0, 240, 255, 0.08);
  border: 1px solid rgba(0, 240, 255, 0.25);
}
.item-card.locked {
  background: rgba(80, 80, 90, 0.15);
  border: 1px solid rgba(120, 120, 130, 0.2);
}
.item-icon {
  font-size: 1.4rem;
  line-height: 1;
  user-select: none;
}
.locked-icon {
  font-size: 1.2rem;
  color: rgba(150, 150, 155, 0.5);
}
</style>

<!-- Global tooltip styles (not scoped) -->
<style>
.catalog-tooltip {
  position: fixed;
  z-index: 9999;
  transform: translateY(-100%) translateY(-8px);
  min-width: 160px;
  max-width: 220px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.72rem;
  pointer-events: none;
  background: rgba(10, 20, 35, 0.97);
  border: 1px solid rgba(0, 240, 255, 0.3);
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}
.catalog-tooltip.lock-tooltip {
  background: rgba(20, 15, 10, 0.97);
  border-color: rgba(200, 100, 50, 0.4);
}
.catalog-tooltip .tt-name {
  font-weight: 700;
  color: var(--neon-cyan, #00f0ff);
  margin-bottom: 2px;
}
.catalog-tooltip .tt-desc {
  color: rgba(200, 200, 210, 0.8);
  line-height: 1.4;
  white-space: normal;
  word-break: keep-all;
}
.catalog-tooltip .tt-title {
  color: rgba(220, 120, 60, 0.9);
  font-weight: 700;
  margin-bottom: 2px;
}
.catalog-tooltip .tt-req {
  color: rgba(200, 180, 150, 0.8);
  line-height: 1.4;
  white-space: normal;
}
</style>
