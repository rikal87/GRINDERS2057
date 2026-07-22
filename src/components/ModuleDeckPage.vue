<template>
  <TerminalLayout :show-back="true" @back="$emit('back')">
    <div class="module-deck-viewport">
      
      <!-- Top Title Header with Watermark Style -->
      <div class="title-block">
        <div class="title-watermark">MODULES</div>
        <h1 class="hero-title">MODULE_DECK<span class="yellow-dot">.</span></h1>
        <div class="sub-syslog cyan">// TEMPLATE_B: HARDWARE_PLUGIN_DECK_BUILDER_&_BUFF_MONITOR</div>
      </div>

      <div class="deck-main-layout">
        <!-- LEFT (380px): Agent Slot Mounting Station (Master) -->
        <aside class="slots-station">
          <div class="station-hdr cyan font-orbitron">// AGENT_SLOT_DECK [{{ taskSlots.length }}_SLOTS]</div>
          
          <div class="slots-list">
            <div v-for="(slot, idx) in taskSlots" :key="idx" 
              class="slot-card" :class="{ locked: slot.isLocked, active: selectedSlotIdx === idx }"
              @click="!slot.isLocked && selectSlot(idx)">
              
              <div class="slot-top font-orbitron">
                <span class="slot-tier yellow">SLOT_0{{ idx + 1 }} // {{ slot.tier }}</span>
                <span class="slot-status-txt" :class="getTaskStatusClass(slot)">{{ slot.statusText }}</span>
              </div>

              <div class="slot-body">
                <h3 class="slot-task-name font-orbitron">{{ slot.task ? getItemName(slot.task) : (slot.isLocked ? 'SLOT_LOCKED' : 'EMPTY_SLOT') }}</h3>
                <p class="slot-task-desc" v-if="slot.task">{{ getItemDesc(slot.task) }}</p>
              </div>

              <div class="slot-actions" v-if="slot.task">
                <button class="btn-unequip-rect font-orbitron" @click.stop="unequipTask(idx)">
                  <span class="btn-txt-layer">[ UNMOUNT_MODULE ] ➔</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- RIGHT: Module Inspection Console & Library Grid (Detail) -->
        <main class="library-station os-scrollbar-custom">
          
          <!-- Selected Module Inspection Screen (If Active Slot Has Module or Preview) -->
          <div class="module-inspection-console" v-if="previewModule || activeSlotTask">
            <div class="inspection-hdr font-orbitron">
              <span class="yellow">// HARDWARE_SPECS_INSPECTOR</span>
              <span class="cyan">CLASS // [{{ getModuleSymbolData(previewModule || activeSlotTask).code }}]</span>
            </div>

            <div class="inspection-body">
              <!-- Reconstructed 32x32 High-Detail Pixel Grid Emoji Device -->
              <PixelGridEmoji 
                :emoji="getModuleSymbolData(previewModule || activeSlotTask).char" 
                :base-color="getModuleSymbolData(previewModule || activeSlotTask).baseColor"
                :shadow-color="getModuleSymbolData(previewModule || activeSlotTask).shadowColor"
                :highlight-color="getModuleSymbolData(previewModule || activeSlotTask).highlightColor"
                :size="72" />

              <div class="inspection-info">
                <h2 class="inspection-title font-orbitron">{{ getItemName(previewModule || activeSlotTask) }}</h2>
                <p class="inspection-desc">{{ getItemDesc(previewModule || activeSlotTask) }}</p>
              </div>

              <div class="inspection-matrix">
                <div class="matrix-box">
                  <span class="lbl cyan font-orbitron">LT_COST</span>
                  <span class="val yellow font-orbitron">{{ (previewModule || activeSlotTask).cost || 0 }} LT</span>
                </div>
                <div class="matrix-box">
                  <span class="lbl cyan font-orbitron">PROBABILITY</span>
                  <span class="val yellow font-orbitron">{{ (((previewModule || activeSlotTask).probability || 1) * 100).toFixed(0) }}%</span>
                </div>
                <div class="matrix-box">
                  <span class="lbl cyan font-orbitron">COOLDOWN</span>
                  <span class="val white font-orbitron">{{ (previewModule || activeSlotTask).cooldown || 0 }}S</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Module Inventory Library Grid -->
          <div class="library-hdr cyan font-orbitron">// UNLOCKED_INVENTORY_LIBRARY [{{ availableModules.length }}_FOUND]</div>

          <div class="library-grid" v-if="availableModules.length > 0">
            <div v-for="mod in availableModules" :key="mod.id" 
              class="module-card" :class="{ equipped: isEquipped(mod.id), previewing: previewModule?.id === mod.id }"
              @click="previewModule = mod">
              
              <div class="mod-top font-orbitron">
                <span class="mod-code cyan">[{{ getModuleSymbolData(mod).code }}]</span>
                <span class="mod-status yellow" v-if="isEquipped(mod.id)">MOUNTED ✓</span>
              </div>

              <div class="mod-body">
                <PixelGridEmoji 
                  :emoji="getModuleSymbolData(mod).char" 
                  :base-color="getModuleSymbolData(mod).baseColor"
                  :shadow-color="getModuleSymbolData(mod).shadowColor"
                  :highlight-color="getModuleSymbolData(mod).highlightColor"
                  :size="48" />

                <h4 class="mod-name font-orbitron">{{ getItemName(mod) }}</h4>
              </div>

              <div class="mod-footer">
                <button class="btn-mount-solid font-orbitron" 
                  :disabled="isEquipped(mod.id) || selectedSlotIdx === null"
                  @click.stop="equipModuleToSlot(mod)">
                  <span class="btn-txt-layer" v-if="isEquipped(mod.id)">MOUNTED</span>
                  <span class="btn-txt-layer" v-else-if="selectedSlotIdx !== null">[ MOUNT ] ➔</span>
                  <span class="btn-txt-layer" v-else>SELECT_SLOT</span>
                </button>
              </div>

            </div>
          </div>

          <div v-else class="empty-library">
            <h3 class="cyan font-orbitron">NO_UNLOCKED_MODULES_FOUND // VISIT_BLACK_MARKET</h3>
          </div>

        </main>
      </div>

    </div>
  </TerminalLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, getLanguage } from '../logic/store.js';
import { AI_TASK_DATA as tasks } from '../logic/aiAgentTaskData.js';
import { audioManager } from '../logic/audioManager.js';
import TerminalLayout from './TerminalLayout.vue';
import PixelGridEmoji from './PixelGridEmoji.vue';

defineEmits(['back']);

const selectedSlotIdx = ref(0);
const previewModule = ref(null);

const taskSlots = computed(() => {
  const currentAgentClass = store.selectedClass || 'VANGUARD';
  const tiers = store.aiAgentTiers[currentAgentClass] || 0;
  const maxSlots = Math.min(6, 1 + tiers); // Slot unlocks per tier

  const result = [];
  for (let i = 0; i < 6; i++) {
    const isLocked = i >= maxSlots;
    const taskOnWork = store.onWorkTasks[i];
    const taskObj = taskOnWork ? tasks.find(t => t.id === taskOnWork.taskId) : null;

    result.push({
      slotIdx: i,
      tier: `TIER_0${i + 1}`,
      isLocked,
      task: taskObj,
      statusText: taskObj ? 'MOUNTED // ACTIVE' : (isLocked ? 'LOCKED' : 'READY // EMPTY')
    });
  }
  return result;
});

const activeSlotTask = computed(() => {
  if (selectedSlotIdx.value === null) return null;
  const slotData = taskSlots.value[selectedSlotIdx.value];
  return slotData ? slotData.task : null;
});

const availableModules = computed(() => {
  return tasks.filter(t => t.id); // All unlocked tasks
});

const getItemName = (item) => {
  if (!item) return '';
  const isKo = getLanguage() === 'ko';
  return isKo ? (item.name_ko || item.name) : (item.name_en || item.name);
};

const getItemDesc = (item) => {
  if (!item) return '';
  const isKo = getLanguage() === 'ko';
  return isKo ? (item.desc_ko || item.desc) : (item.desc_en || item.desc);
};

const isEquipped = (taskId) => {
  return store.onWorkTasks.some(t => t && t.taskId === taskId);
};

const getModuleSymbolData = (item) => {
  if (!item) return { code: 'HARDWARE', char: '♣', baseColor: '#ffffff', shadowColor: '#666666', highlightColor: '#ffffff' };
  const typeStr = String(item.type || '').toUpperCase();
  if (typeStr.includes('JOKER') || typeStr.includes('TACTICAL')) {
    return { code: 'TACTICAL', char: '♠', baseColor: '#00f0ff', shadowColor: '#006680', highlightColor: '#80f8ff' };
  } else if (typeStr.includes('ACTIVE')) {
    return { code: 'ACTIVE', char: '♦', baseColor: '#ff005c', shadowColor: '#80002e', highlightColor: '#ff80ae' };
  } else if (typeStr.includes('BATTERY') || typeStr.includes('CONSUMABLE')) {
    return { code: 'BATTERY', char: '♥', baseColor: '#ccff00', shadowColor: '#668000', highlightColor: '#e6ff80' };
  } else {
    return { code: 'HARDWARE', char: '♣', baseColor: '#ffffff', shadowColor: '#666666', highlightColor: '#ffffff' };
  }
};

const selectSlot = (idx) => {
  audioManager.playSFX('ui-click');
  selectedSlotIdx.value = idx;
  previewModule.value = null;
};

const equipModuleToSlot = (moduleObj) => {
  if (selectedSlotIdx.value === null) return;
  audioManager.playSFX('install');
  store.equipTaskToSlot(selectedSlotIdx.value, moduleObj.id);
};

const unequipTask = (slotIdx) => {
  audioManager.playSFX('error');
  store.unequipTaskFromSlot(slotIdx);
};

const getTaskStatusClass = (slot) => {
  if (slot.task) return 'yellow';
  if (slot.isLocked) return 'magenta';
  return 'cyan';
};
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';
@import '../assets/css/theme-os.css';

.font-orbitron {
  font-family: 'Orbitron', 'Pretendard Std', sans-serif !important;
}

.cyan { color: var(--neon-cyan) !important; }
.yellow { color: var(--neon-yellow) !important; }
.magenta { color: var(--neon-magenta) !important; }
.white { color: #ffffff !important; }

.module-deck-viewport {
  padding: 1.5rem 4rem;
  max-width: 1350px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.title-block {
  position: relative;
  margin-bottom: 1.8rem;
}

.title-watermark {
  position: absolute;
  top: -25px;
  left: -10px;
  font-size: 6rem;
  font-weight: 900;
  color: rgba(0, 240, 255, 0.03);
  letter-spacing: 0.1em;
  pointer-events: none;
  font-family: 'Orbitron', sans-serif;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 900;
  margin: 0;
  color: #ffffff;
  font-family: 'Orbitron', sans-serif;
}

.yellow-dot { color: var(--neon-yellow); }
.sub-syslog { font-size: 0.85rem; letter-spacing: 0.15em; margin-top: 0.4rem; font-family: 'Orbitron', sans-serif; }

.deck-main-layout {
  display: flex;
  gap: 2rem;
  height: 680px;
}

/* Left Slots Station */
.slots-station {
  width: 380px;
  background: rgba(4, 8, 12, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.station-hdr {
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.slots-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  overflow-y: auto;
}

.slot-card {
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.15);
  padding: 1rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slot-card:hover:not(.locked) {
  border-color: var(--neon-cyan);
}

.slot-card.active {
  border-color: var(--neon-yellow);
  background: rgba(204, 255, 0, 0.05);
}

.slot-card.locked {
  opacity: 0.4;
  cursor: not-allowed;
}

.slot-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  font-weight: 900;
  margin-bottom: 0.4rem;
}

.slot-task-name {
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.2rem 0;
}

.slot-task-desc {
  font-size: 0.8rem;
  color: #8095aa;
  margin: 0;
}

.slot-actions {
  margin-top: 0.8rem;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(255, 0, 92, 0.2);
}

.btn-unequip-rect {
  background: var(--neon-magenta);
  border: 1px solid var(--neon-magenta);
  color: #ffffff !important;
  font-weight: 900;
  font-size: 0.78rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border-radius: 0px;
  width: 100%;
}

/* Right Library Station */
.library-station {
  flex: 1;
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.25);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
}

.module-inspection-console {
  background: rgba(8, 12, 16, 0.95);
  border: 1px solid var(--neon-cyan);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.inspection-hdr {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  font-weight: 900;
}

.inspection-body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.inspection-info {
  flex: 1;
}

.inspection-title {
  font-size: 1.4rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 0.4rem 0;
}

.inspection-desc {
  font-size: 0.88rem;
  color: #b0c8e0;
  margin: 0;
}

.inspection-matrix {
  display: flex;
  gap: 1rem;
}

.matrix-box {
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.15);
  padding: 0.6rem 0.9rem;
  display: flex;
  flex-direction: column;
}

.lbl { font-size: 0.7rem; font-weight: 900; }
.val { font-size: 1.1rem; font-weight: 900; }

.library-hdr {
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.library-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.module-card {
  background: rgba(8, 12, 16, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.18);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
}

.module-card:hover {
  border-color: var(--neon-yellow);
}

.module-card.equipped {
  border-color: var(--neon-yellow);
}

.mod-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 900;
  margin-bottom: 0.6rem;
}

.mod-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.mod-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.mod-footer {
  margin-top: 0.8rem;
}

.btn-mount-solid {
  background: var(--neon-yellow);
  border: 1px solid var(--neon-yellow);
  color: #000000 !important;
  font-weight: 900;
  font-size: 0.8rem;
  padding: 0.5rem;
  width: 100%;
  cursor: pointer;
  border-radius: 0px;
  box-shadow: 0 0 10px rgba(204, 255, 0, 0.3);
}

.btn-mount-solid:disabled {
  background: #1a222a;
  border-color: #1a222a;
  color: #405060 !important;
  box-shadow: none;
  cursor: not-allowed;
}

.empty-library {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

/* Mobile Responsive Media Queries */
@media screen and (max-width: 768px) {
  .module-deck-viewport {
    padding: 1rem;
  }

  .deck-main-layout {
    flex-direction: column;
    height: auto;
    gap: 1.2rem;
  }

  .slots-station {
    width: 100%;
    box-sizing: border-box;
  }

  .library-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.8rem;
  }

  .inspection-body {
    flex-direction: column;
    align-items: flex-start;
  }

  .inspection-matrix {
    flex-wrap: wrap;
  }
}
</style>
