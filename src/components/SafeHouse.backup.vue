<template>
  <div class="safe-house v4">
    <div class="v4-bg-border"></div>

    <!-- HEADER -->
    <header class="v4-header">
      <h1>SAFEHOUSE_INTERFACE</h1>
    </header>

    <!-- MAIN BODY: 3 PANELS -->
    <div class="v4-body">

      <!-- LEFT PANEL: OPERATIVE STATUS -->
      <section class="v4-panel v4-panel-left">
        <div class="v4-inner">
          <div class="v4-label">OPERATIVE_STATUS</div>

          <div class="v4-card-block">
            <div class="v4-row-entry">
              <span class="v4-key">CALL_SIGN:</span>
              <span class="v4-val yellow">{{ store.selectedClass }}</span>
            </div>
            <div class="v4-row-entry">
              <span class="v4-key">NEURAL_LVL:</span>
              <span class="v4-val white">{{ store.level }}</span>
            </div>
            <div class="v4-row-entry">
              <span class="v4-key">SYNC:</span>
              <span class="v4-val">{{ xpPercent.toFixed(1) }}%</span>
            </div>
          </div>
          <div class="v4-progress-row">
            <div class="v4-progress-track">
              <div class="v4-progress-fill" :style="{ width: xpPercent + '%' }"></div>
            </div>
          </div>

          <div class="v4-card-block">
            <div class="v4-row-entry">
              <span class="v4-key">CREDIT_STOCK:</span>
              <span class="v4-val yellow">{{ store.bankroll.toLocaleString() }} CR</span>
            </div>
            <div class="v4-row-entry">
              <span class="v4-key">LUDUS_ASSETS:</span>
              <span class="v4-val cyan">{{ Math.floor(store.ludusTokens) }} LT</span>
            </div>
          </div>

          <div class="v4-sep-label">NEURAL_SLOTS</div>
          <div class="v4-slot-list">
            <div v-for="(type, idx) in currentSlots" :key="idx" class="v4-slot-entry" :class="type.toLowerCase()"
              @click="openSkillSelector(idx, type)">
              <span class="slot-tier">{{ type }}</span>
              <span class="slot-val" v-if="store.equippedSkills[idx]">{{ store.equippedSkills[idx].name }}</span>
              <span class="slot-val empty" v-else>LINK_PENDING</span>
            </div>
          </div>
        </div>
      </section>

      <!-- CENTER PANEL: GEAR / INVENTORY -->
      <section class="v4-panel v4-panel-center">
        <div class="v4-inner">
          <div class="v4-tab-row">
            <button :class="{ active: mainTab === 'hardware' }" @click="mainTab = 'hardware'">HARDWARE</button>
            <button :class="{ active: mainTab === 'crypto' }" @click="mainTab = 'crypto'">CRYPTO_ASSETS</button>
          </div>

          <div class="v4-tab-content">
            <!-- Hardware / Protectors -->
            <div v-if="mainTab === 'hardware'" class="v4-item-list">
              <div v-for="p in store.ownedProtectors" :key="p.instanceId" class="v4-item-card"
                :class="{ mounted: store.equippedProtector?.instanceId === p.instanceId }">
                <div class="v4-item-row">
                  <span class="v4-key">UNIT_ID:</span>
                  <span class="v4-val white">{{ p.name }}</span>
                </div>
                <div class="v4-item-actions">
                  <button v-if="store.equippedProtector?.instanceId !== p.instanceId" class="v4-btn cyan"
                    @click="equip(p)">MOUNT</button>
                  <button class="v4-btn red" @click="sellItem(p)">SCRAP</button>
                </div>
              </div>
              <div v-if="store.ownedProtectors.length === 0" class="v4-empty-state">
                CARGO_EMPTY
              </div>
            </div>

            <!-- Crypto Assets -->
            <div v-else class="v4-crypto-list">
              <div v-for="coin in marketState.coins" :key="coin.id" class="v4-item-card">
                <div class="v4-item-row">
                  <span class="v4-key">{{ coin.symbol }}</span>
                  <span class="v4-val yellow">${{ coin.price.toFixed(2) }}</span>
                </div>
                <div class="v4-item-actions">
                  <button class="v4-btn red" @click="sellCoin(coin.id, 0.5)">SELL 50%</button>
                  <button class="v4-btn red" @click="sellCoin(coin.id, 1.0)">DUMP ALL</button>
                </div>
              </div>
            </div>
          </div>

          <!-- AI AGENT STATUS -->
          <div class="v4-sep-label">AI_AGENT_MODULE</div>
          <div class="v4-card-block">
            <div class="v4-row-entry">
              <span class="v4-key">CORE:</span>
              <span class="v4-val cyan">{{ store.aiAgent.model }}</span>
            </div>
            <div class="v4-row-entry">
              <span class="v4-key">GRADE:</span>
              <span class="v4-val">TIER_{{ store.aiAgent.tier }}</span>
            </div>
          </div>

          <div class="v4-agent-tasks">
            <div class="v4-sep-label">ACTIVE_SUBROUTINES</div>
            <div v-for="task in activeTasksWithData" :key="task.taskId" class="v4-task-item">
              <span class="v4-key">{{ task.data.name }}</span>
              <span class="v4-val yellow">{{ formatTime(task.elapsed) }}</span>
            </div>
            <div v-if="activeTasksWithData.length === 0" class="v4-empty-state">AGENT_IDLE</div>
          </div>

          <div class="v4-task-launchers">
            <button v-for="task in AI_TASK_DATA" :key="task.id" class="v4-btn"
              :class="isTaskRunning(task.id) ? 'active' : ''" @click="handleStartTask(task.id)">
              {{ task.name.split(' ')[0] }}
            </button>
          </div>
        </div>
      </section>

      <!-- RIGHT PANEL: SECURE INBOX -->
      <section class="v4-panel v4-panel-right">
        <div class="v4-inner">
          <div class="v4-label">
            SECURE_COMMS
            <span class="v4-badge" v-if="unreadCount">{{ unreadCount }}</span>
          </div>

          <div class="v4-msg-list">
            <div v-for="msg in store.messages" :key="msg.id" class="v4-msg-entry"
              :class="{ unread: !msg.isRead, active: selectedMessage?.id === msg.id }" @click="selectMessage(msg)">
              <div class="v4-msg-head">
                <span class="type">{{ msg.type }}</span>
                <span class="date">{{ new Date(msg.timestamp).toISOString().split('T')[0] }}</span>
              </div>
              <span class="v4-msg-title">{{ msg.title }}</span>
            </div>
          </div>

          <div class="v4-msg-reader" v-if="selectedMessage">
            <div class="v4-sep-label">MESSAGE_CONTENT</div>
            <div class="v4-msg-body">{{ selectedMessage.body }}</div>
            <div class="v4-msg-actions">
              <button v-for="(act, idx) in selectedMessage.actions" :key="idx" class="v4-btn cyan"
                @click="triggerMessageAction(selectedMessage.id, idx)">
                {{ act.label }}
              </button>
            </div>
          </div>
          <div v-else class="v4-empty-state reader-idle">
            SELECT_MESSAGE
          </div>
        </div>
      </section>
    </div>

    <!-- BOTTOM ACTION BAR -->
    <footer class="v4-footer">
      <div class="v4-footer-left">
        <span class="footer-status">● SYS_ONLINE</span>
      </div>
      <div class="v4-footer-right">
        <button class="v4-btn footer-abort" @click="$emit('back')">DISCONNECT [ESC]</button>
      </div>
    </footer>

    <!-- SKILL SELECTOR MODAL -->
    <transition name="v4-fade">
      <div v-if="showSkillSelector" class="v4-modal-overlay" @click.self="closeSkillSelector">
        <div class="v4-modal">
          <div class="v4-label">SELECT_SUBROUTINE: {{ activeSlotType }}</div>
          <div class="v4-modal-list">
            <div v-for="sk in filteredSkillsForSlot" :key="sk.id" class="v4-item-card" @click="equipSkill(sk)">
              <div class="v4-item-row">
                <span class="v4-val white">{{ sk.name }}</span>
                <span class="v4-val yellow">{{ sk.tier }}</span>
              </div>
              <div class="v4-key">{{ sk.desc }}</div>
              <div class="v4-key" style="opacity:0.4;">RAM: {{ sk.ramOccupation }}GB</div>
            </div>
          </div>
          <div class="v4-modal-footer">
            <button class="v4-btn red" @click="equipSkill(null)">DE_ATTACH</button>
            <button class="v4-btn" @click="closeSkillSelector">CANCEL</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { store, getNextLevelThreshold } from '../logic/store';
import { marketState, sellCoin } from '../logic/cryptoMarket';
import { markAsRead, handleMessageAction as processMsgAction } from '../logic/messageSystem';
import { AI_TASK_DATA, startTask } from '../logic/aiTaskSystem';
import { audioManager } from '../logic/audioManager';
import { SKILL_DATA, getSlotConfig } from '../logic/skills';

const mainTab = ref('hardware');
const selectedMessage = ref(null);
const showSkillSelector = ref(false);
const activeSlotIdx = ref(null);
const activeSlotType = ref(null);
const currentTime = ref(Date.now());

let timer = null;
onMounted(() => { timer = setInterval(() => { currentTime.value = Date.now(); }, 1000); });
onUnmounted(() => { clearInterval(timer); });

const currentSlots = computed(() => getSlotConfig(store.level));
const xpPercent = computed(() => Math.min((store.xp / getNextLevelThreshold()) * 100, 100));

const openSkillSelector = (idx, type) => { activeSlotIdx.value = idx; activeSlotType.value = type; showSkillSelector.value = true; };
const closeSkillSelector = () => { showSkillSelector.value = false; activeSlotIdx.value = null; activeSlotType.value = null; };

const filteredSkillsForSlot = computed(() => {
  if (!activeSlotType.value) return [];
  const type = activeSlotType.value;
  return SKILL_DATA.filter(sk => {
    if (type === 'ULT') return true;
    const slotTier = parseInt(type.substring(1));
    const skTier = sk.tier === 'ULT' ? 99 : parseInt(sk.tier.substring(1));
    return skTier <= slotTier;
  });
});

const equipSkill = (skill) => { store.equippedSkills[activeSlotIdx.value] = skill; closeSkillSelector(); audioManager.playSFX('action-confirm'); };
const activeTasksWithData = computed(() => store.aiAgent.activeTasks.map(t => ({ ...t, data: AI_TASK_DATA.find(d => d.id === t.taskId), elapsed: currentTime.value - t.startTime })));
const isTaskRunning = (taskId) => store.aiAgent.activeTasks.some(t => t.taskId === taskId);
const handleStartTask = (taskId) => { if (startTask(taskId)) audioManager.playSFX('action-confirm'); };
const formatTime = (ms) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`; };
const unreadCount = computed(() => store.messages.filter(m => !m.isRead).length);
const selectMessage = (msg) => { selectedMessage.value = msg; if (!msg.isRead) markAsRead(msg.id); };
const triggerMessageAction = (msgId, idx) => { processMsgAction(msgId, idx); selectedMessage.value = null; };
const equip = (item) => { store.equippedProtector = item; audioManager.playSFX('action-confirm'); };
const sellItem = (item) => {
  if (store.equippedProtector?.instanceId === item.instanceId) return;
  gainBankroll(Math.floor((item.price || 100) * 0.25), TYPE_CHANGE_BANKROLL.SELL_ITEM);
  const idx = store.ownedProtectors.findIndex(p => p.instanceId === item.instanceId);
  if (idx !== -1) store.ownedProtectors.splice(idx, 1);
  audioManager.playSFX('coin-throw');
};
</script>

<style scoped src="../styles/components/SafeHouse.css"></style>
