<template>
  <TerminalLayout :show-back="true" @back="$emit('back')">
    <div class="comms-inbox-viewport">
      <div class="title-block">
        <div class="title-watermark">COMMS</div>
        <h1 class="hero-title">COMMS_INBOX<span class="yellow-dot">.</span></h1>
        <div class="sub-syslog cyan">// TEMPLATE_C: DUAL_LOG_STREAM_SECURE_MESSENGER</div>
      </div>

      <div class="comms-main-layout">
        <!-- LEFT: Message Feed Stream -->
        <aside class="inbox-list-station os-scrollbar-custom">
          <div class="station-hdr cyan">// INCOMING_LOGS [{{ store.messages.length }}_MESSAGES]</div>

          <div v-if="store.messages.length > 0" class="msg-cards-list">
            <div v-for="msg in store.messages" :key="msg.id" class="msg-card"
              :class="{ unread: !msg.read, active: selectedMsg?.id === msg.id }" @click="selectMessage(msg)">

              <div class="msg-card-top">
                <span class="sender-name cyan">// {{ msg.sender || 'SYSTEM_NODE' }}</span>
                <!-- Left Feed: Smart i18n Relative Time -->
                <span class="msg-date font-orbitron">{{ formatRelativeShortDate(msg.timestamp) }}</span>
              </div>
              <h3 class="msg-card-title">{{ msg.title }}</h3>
            </div>
          </div>

          <div v-else class="empty-inbox">
            <h2 class="cyan">NO_INCOMING_TRANSMISSIONS</h2>
          </div>
        </aside>

        <!-- RIGHT: Selected Message Terminal Screen -->
        <main class="msg-viewer-station os-scrollbar-custom">
          <template v-if="selectedMsg">
            <div class="viewer-hdr">
              <span class="sender-badge yellow font-orbitron">// {{ selectedMsg.sender || 'SYSTEM' }}</span>
              <!-- Right Viewer: Precise Absolute Timestamp -->
              <span class="date-badge cyan font-orbitron">{{ formatFullDateTime(selectedMsg.timestamp) }}</span>
            </div>

            <div class="viewer-content">
              <h2 class="viewer-title">{{ selectedMsg.title }}</h2>
              <div class="viewer-divider"></div>
              <p class="viewer-body-text" v-html="selectedMsg.body"></p>

              <!-- Table Finder 100% Mirroring Tactical Card Viewer -->
              <div class="table-finder-card-mirror" v-if="pendingInviteAction && targetLocation">
                
                <!-- 1. Yellow Header Bar -->
                <div class="card-header-bar font-orbitron">
                  <span class="card-num">02 //</span>
                  <div class="card-title-group">
                    <h2 class="card-main-title">{{ isKorean ? targetLocation.name_ko : targetLocation.name_en }}</h2>
                    <span class="card-zone-sub">{{ targetLocation.atmosphere || 'CYBER_CASINO_ZONE' }}</span>
                  </div>
                  <div class="card-meta-right">
                    <span class="card-stake-tag">{{ (targetLocation.tables?.amount || 10000).toLocaleString() }} CR</span>
                  </div>
                </div>

                <!-- 2. Visual Banner with Background Image & Story Description -->
                <div class="card-visual-banner" :style="{ backgroundImage: `url(${targetLocation.imgSrc})` }">
                  <div class="fui-scanline-lens"></div>
                  <div class="visual-overlay"></div>
                  
                  <div class="banner-content">
                    <span class="status-tag yellow font-orbitron" v-if="targetLocation.isDrunken">SPECIAL_RULE: 🍺 DRUNKEN_STATUS</span>
                    <p class="banner-desc">
                      {{ isKorean ? targetLocation.description_ko : targetLocation.description_en }}
                    </p>
                  </div>
                </div>

                <!-- 3. 4-Tile Tactical Specs Grid -->
                <div class="specs-grid">
                  <div class="spec-tile">
                    <span class="spec-lbl cyan font-orbitron">BUY_IN</span>
                    <span class="spec-val yellow font-orbitron">{{ (targetLocation.tables?.amount || 10000).toLocaleString() }} CR</span>
                  </div>

                  <div class="spec-tile">
                    <span class="spec-lbl cyan font-orbitron">BLINDS</span>
                    <span class="spec-val cyan font-orbitron">{{ (targetLocation.tables?.sb || 50).toLocaleString() }} / {{ (targetLocation.tables?.bb || 100).toLocaleString() }}</span>
                  </div>

                  <div class="spec-tile">
                    <span class="spec-lbl cyan font-orbitron">RAKE</span>
                    <span class="spec-val white font-orbitron">{{ ((targetLocation.tables?.baseRake || 0.05) * 100).toFixed(1) }}%</span>
                  </div>

                  <div class="spec-tile">
                    <span class="spec-lbl cyan font-orbitron">RULES</span>
                    <span class="spec-val magenta font-orbitron" v-if="targetLocation.isDeathmatch">DEATHMATCH</span>
                    <span class="spec-val cyan font-orbitron" v-else-if="targetLocation.isDrunken">🍺 DRUNKEN</span>
                    <span class="spec-val cyan font-orbitron" v-else>STANDARD</span>
                  </div>
                </div>

                <!-- 4. -20deg Skewed Action Button Bar -->
                <div class="card-footer-action">
                  <div class="capacity-tag font-orbitron">
                    CAPACITY: <span class="cyan">MAX_{{ targetLocation.tables?.available ? targetLocation.tables.available[0] : 6 }}P</span>
                  </div>

                  <div class="action-btn-group">
                    <button class="btn-initiate-link font-orbitron" @click="confirmAndJoinTable">
                      <span class="btn-txt-layer">
                        {{ pendingInviteAction?.actionType === 'SPECTATE_MATCH' ? '[ SPECTATE_MATCH ] ➔' : '[ JOIN_TABLE ] ➔' }}
                      </span>
                    </button>

                    <button class="btn-abort-link font-orbitron" @click="pendingInviteAction = null">
                      <span class="btn-txt-layer">ABORT</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <!-- Standard Message Action Buttons -->
            <div class="viewer-actions" v-if="!pendingInviteAction">
              <label v-for="(act, idx) in selectedMsg.actions" :key="idx">
                <button class="btn" :class="`btn-${idx}`" @click="triggerMessageAction(selectedMsg.id, idx)">
                  <small v-if="act.payload && act.payload.amount" :class="`${act.payload.currency}`">
                    {{ act.payload.amount ? ' ' + act.payload.amount.toLocaleString() : '' }} {{ act.payload.currency }}
                  </small>
                  <span v-if="act.label">{{ act.label }}</span>
                </button>
              </label>
              <button class="sell-btn" :disabled="selectedMsg?.actions && selectedMsg.actions.length > 0"
                @click="deleteMessageBtn(selectedMsg.id)">DELETE</button>
            </div>
          </template>

          <template v-else>
            <div class="empty-viewer-prompt">
              <span class="cursor-prompt cyan">>&nbsp;</span>
              <span class="prompt-txt yellow">SELECT_AN_ENCRYPTED_LOG_FROM_THE_LEFT_INBOX</span>
            </div>
          </template>
        </main>
      </div>
    </div>
  </TerminalLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, getLanguage } from '../logic/store';
import { handleMessageAction, deleteMessage } from '../logic/messageSystem';
import { zones } from '../logic/zone';
import { audioManager } from '../logic/audioManager';
import TerminalLayout from './TerminalLayout.vue';

const emit = defineEmits(['back', 'join-table']);

const selectedMsg = ref(store.messages[0] || null);
const pendingInviteAction = ref(null);

const isKorean = computed(() => getLanguage() === 'ko');

const targetLocation = computed(() => {
  const payload = pendingInviteAction.value?.payload;
  if (!payload) return null;
  const locId = payload.location_id || payload.locationId || payload.id;
  if (!locId) return null;

  // Search in all zones
  for (const zone of zones) {
    if (zone.locations) {
      const found = zone.locations.find(l => l.id === locId);
      if (found) return found;
    }
  }

  // Fallback to first zone location if specific location not found
  return zones[0]?.locations[0] || null;
});

const selectMessage = (msg) => {
  audioManager.playSFX('ui-click');
  msg.isRead = true;
  selectedMsg.value = msg;
  pendingInviteAction.value = null;
};

const triggerMessageAction = (msgId, actionIdx) => {
  const msg = store.messages.find(m => m.id === msgId);
  if (!msg || !msg.actions[actionIdx]) return;

  const action = msg.actions[actionIdx];
  const payload = action.payload || {};

  const actionType = action.actionType || action.type;
  const isInviteAction = actionType === 'ACCEPT_INVITE' || actionType === 'ACCEPT' || actionType === 'SPECTATE_MATCH' || payload.location_id || payload.locationId;

  // If it's an invitation or live spectate alert for a table, show Zone Preview Card
  if (isInviteAction) {
    audioManager.playSFX('ui-click');
    pendingInviteAction.value = action;
  } else {
    // Normal Message Action (e.g. Receive money, Pay rent)
    audioManager.playSFX('reward');
    handleMessageAction(msgId, actionIdx);
  }
};

const confirmAndJoinTable = () => {
  if (!pendingInviteAction.value || !selectedMsg.value) return;
  audioManager.playSFX('reward');
  const action = pendingInviteAction.value;
  const msgId = selectedMsg.value.id;

  handleMessageAction(msgId, 0);
  pendingInviteAction.value = null;
};

const deleteMessageBtn = (msgId) => {
  audioManager.playSFX('error');
  deleteMessage(msgId);
  if (selectedMsg.value?.id === msgId) {
    selectedMsg.value = store.messages[0] || null;
  }
};

/**
 * i18n Smart Relative Short Time Helper (KO / EN Support)
 */
const formatRelativeShortDate = (timestamp) => {
  if (!timestamp) return 'REALTIME';
  
  const msgTime = new Date(timestamp);
  if (isNaN(msgTime.getTime())) return String(timestamp);

  const now = new Date(store.gameTime || Date.now());
  const diffMs = now.getTime() - msgTime.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHour / 24);

  const isKo = isKorean.value;

  if (diffSec < 60) {
    return isKo ? '방금 전' : 'JUST NOW';
  } else if (diffMin < 60) {
    return isKo ? `${diffMin}분 전` : `${diffMin}M AGO`;
  } else if (diffHour < 24) {
    return isKo ? `${diffHour}시간 전` : `${diffHour}H AGO`;
  } else if (diffDays === 1) {
    return isKo ? '어제' : 'YESTERDAY';
  } else if (diffDays === 2) {
    return isKo ? '2일 전' : '2D AGO';
  } else if (diffDays <= 7) {
    return isKo ? `${diffDays}일 전` : `${diffDays}D AGO`;
  } else {
    const month = String(msgTime.getMonth() + 1).padStart(2, '0');
    const day = String(msgTime.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  }
};

/**
 * Right Viewer: Precise Absolute Timestamp (예: 2057-03-05 08:23 PM)
 */
const formatFullDateTime = (timestamp) => {
  if (!timestamp) return 'REALTIME_TIMESTAMP';
  const msgTime = new Date(timestamp);
  if (isNaN(msgTime.getTime())) return String(timestamp);

  const year = msgTime.getFullYear();
  const month = String(msgTime.getMonth() + 1).padStart(2, '0');
  const day = String(msgTime.getDate()).padStart(2, '0');
  
  let hours = msgTime.getHours();
  const minutes = String(msgTime.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, '0');

  return `${year}-${month}-${day} ${hoursStr}:${minutes} ${ampm}`;
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

.comms-inbox-viewport {
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

.comms-main-layout {
  display: flex;
  gap: 2rem;
  height: 680px;
}

.inbox-list-station {
  width: 420px;
  background: rgba(4, 8, 12, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.station-hdr {
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  font-family: 'Orbitron', sans-serif;
}

.msg-cards-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.msg-card {
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.15);
  padding: 1rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.msg-card:hover {
  border-color: var(--neon-cyan);
}

.msg-card.active {
  background: var(--neon-cyan);
  border-color: var(--neon-cyan);
}

.msg-card.active .sender-name,
.msg-card.active .msg-date,
.msg-card.active .msg-card-title {
  color: #000000 !important;
}

.msg-card-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.sender-name { font-size: 0.78rem; font-weight: 900; }
.msg-date { font-size: 0.75rem; color: #8095aa; font-weight: 700; }

.msg-card-title {
  font-size: 0.98rem;
  font-weight: 800;
  margin: 0;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-viewer-station {
  flex: 1;
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.25);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
}

.viewer-hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 240, 255, 0.15);
}

.sender-badge { font-size: 0.95rem; font-weight: 900; }
.date-badge { font-size: 0.88rem; font-weight: 800; letter-spacing: 0.05em; }

.viewer-content {
  flex: 1;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
}

.viewer-title {
  font-size: 1.8rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 1rem 0;
}

.viewer-divider {
  height: 1px;
  background: var(--neon-yellow);
  width: 80px;
  margin-bottom: 1.5rem;
}

.viewer-body-text {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #d0e4f8;
}

/* =============================================
   Table Finder 100% Mirroring Visual Card
   ============================================= */
.table-finder-card-mirror {
  margin-top: 1.5rem;
  border: 1px solid var(--neon-yellow);
  background: rgba(8, 12, 16, 0.95);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header-bar {
  display: flex;
  align-items: center;
  padding: 1.1rem 1.8rem;
  background: var(--neon-yellow);
  color: #000000;
  user-select: none;
}

.card-num {
  font-size: 1.5rem;
  font-weight: 900;
  width: 60px;
}

.card-title-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-main-title {
  font-size: 1.6rem;
  font-weight: 900;
  margin: 0;
  color: #000000;
}

.card-zone-sub {
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 0.08em;
}

.card-stake-tag {
  font-size: 1.1rem;
  font-weight: 900;
}

.card-visual-banner {
  position: relative;
  height: 180px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 1.2rem 1.8rem;
}

.visual-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.1) 100%);
}

.banner-content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.status-tag {
  font-size: 0.78rem;
  font-weight: 900;
}

.banner-desc {
  font-size: 0.92rem;
  color: #e0f0ff;
  margin: 0;
  line-height: 1.4;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.8rem;
  padding: 1.2rem 1.8rem;
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid rgba(0, 240, 255, 0.15);
}

.spec-tile {
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.18);
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.spec-lbl {
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.spec-val {
  font-size: 1.05rem;
  font-weight: 900;
}

.card-footer-action {
  padding: 1rem 1.8rem;
  background: #000000;
  border-top: 1px solid rgba(0, 240, 255, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.capacity-tag {
  font-size: 0.85rem;
  font-weight: 900;
}

.action-btn-group {
  display: flex;
  gap: 1rem;
}

.btn-initiate-link {
  background: var(--neon-yellow);
  border: 1px solid var(--neon-yellow);
  color: #000000 !important;
  padding: 0.85rem 1.8rem;
  font-weight: 900;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transform: skewX(-20deg);
  border-radius: 0px;
  box-shadow: 0 0 15px rgba(204, 255, 0, 0.35);
  transition: all 0.2s ease;
}

.btn-initiate-link:hover {
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.6);
  transform: skewX(-20deg) translateY(-2px);
}

.btn-abort-link {
  background: #1a222a;
  border: 1px solid #405060;
  color: #c0d4e8 !important;
  padding: 0.85rem 1.4rem;
  font-weight: 900;
  font-size: 0.9rem;
  cursor: pointer;
  transform: skewX(-20deg);
  border-radius: 0px;
}

.btn-txt-layer {
  display: inline-block;
  transform: skewX(20deg);
}

.viewer-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 240, 255, 0.15);
}

.btn {
  background: var(--neon-yellow);
  border: 1px solid var(--neon-yellow);
  color: #000000;
  font-family: 'Orbitron', 'Pretendard Std', sans-serif;
  font-weight: 900;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
}

.sell-btn {
  background: var(--neon-magenta);
  border: 1px solid var(--neon-magenta);
  color: #ffffff;
  font-family: 'Orbitron', 'Pretendard Std', sans-serif;
  font-weight: 900;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
}

.sell-btn:disabled {
  background: #1a222a;
  border-color: #1a222a;
  color: #405060;
  cursor: not-allowed;
}

.empty-viewer-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  font-size: 1.1rem;
}

/* =============================================
   MOBILE RESPONSIVE MEDIA QUERIES (<= 768px)
   ============================================= */
@media screen and (max-width: 768px) {
  .comms-inbox-viewport {
    padding: 1rem;
  }

  .comms-main-layout {
    flex-direction: column;
    height: auto;
    gap: 1.2rem;
  }

  .inbox-list-station {
    width: 100%;
    max-height: 250px;
    box-sizing: border-box;
  }

  .msg-viewer-station {
    width: 100%;
    padding: 1.2rem;
    box-sizing: border-box;
  }

  .specs-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    padding: 1rem;
  }

  .card-footer-action {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .action-btn-group {
    justify-content: space-between;
  }

  .btn-initiate-link,
  .btn-abort-link {
    flex: 1;
    text-align: center;
    padding: 0.8rem 0.5rem;
  }
}

</style>
