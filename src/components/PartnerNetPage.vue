<template>
  <TerminalLayout :show-back="true" @back="$emit('back')">
    <div class="partner-net-viewport">
      
      <!-- Top Title Header with Watermark Style -->
      <div class="title-block">
        <div class="title-watermark">PARTNERS</div>
        <h1 class="hero-title">PARTNERS_NET<span class="yellow-dot">.</span></h1>
        <div class="sub-syslog cyan">// TEMPLATE_B: MASTER-DETAIL_FINANCIAL_CONTRACT_CONSOLE</div>
      </div>

      <div class="master-detail-console" v-if="partners.length > 0">
        <!-- LEFT (30%): Master Partner Index Bar with Huge Typography -->
        <aside class="master-index-station os-scrollbar-custom">
          <div class="station-hdr cyan">// PARTNER_INDEX [{{ partners.length }}_REGISTERED]</div>

          <div class="partner-index-list">
            <div v-for="(partner, idx) in partners" :key="partner.id"
              class="index-card" :class="{ active: selectedPartnerId === partner.id }"
              @click="selectPartner(partner.id)">
              <div class="index-num">0{{ idx + 1 }}</div>
              <div class="index-body">
                <h3 class="index-name">{{ partner.name }}</h3>
                <span class="index-sub cyan">// {{ partner.philosophy || 'INDEPENDENT' }}</span>
              </div>
              <div class="index-affinity yellow">{{ Math.round((partner.relationship || 0) / 10) }}%</div>
            </div>
          </div>
        </aside>

        <!-- RIGHT (70%): Huge Typography & High-Contrast Detail Station -->
        <main class="detail-control-station os-scrollbar-custom" v-if="selectedPartner">
          
          <!-- Background Watermark Typography for Selected Partner -->
          <div class="partner-watermark-bg">{{ selectedPartner.name.toUpperCase() }}</div>

          <!-- Top Profile Banner -->
          <div class="panel-hdr-bar">
            <div class="partner-identity">
              <div class="identity-tag yellow">// SUBJECT_0{{ getPartnerIndex(selectedPartner.id) }}</div>
              <h2 class="selected-name">{{ selectedPartner.name }}</h2>
              <span class="philosophy-tag cyan">PHILOSOPHY: {{ selectedPartner.philosophy || 'INDEPENDENT' }}</span>
            </div>

            <div class="affinity-gauge-box">
              <div class="affinity-lbl-row">
                <span class="cyan">RELATIONSHIP_AFFINITY</span>
                <span class="yellow">{{ Math.round((selectedPartner.relationship || 0) / 10) }} / 100</span>
              </div>
              <div class="gauge-track">
                <div class="gauge-fill" :style="{ width: Math.min(100, Math.round((selectedPartner.relationship || 0) / 10)) + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Partner Bio Note -->
          <div class="partner-bio-box">
            <div class="bio-hdr cyan">// DOSSIER_SUMMARY</div>
            <p class="bio-text">{{ getLocalizedText(CLASSES_PARTNER.find(c => c.id === selectedPartner.id), 'note') }}</p>
          </div>

          <!-- Financial Matrix (Bankroll & Balance) -->
          <div class="financial-matrix-grid">
            <div class="matrix-box yellow-border">
              <span class="matrix-lbl cyan">PARTNER_BANKROLL</span>
              <span class="matrix-val yellow">{{ (selectedPartner.bankroll || 0).toLocaleString() }} <small>CR</small></span>
            </div>
            <div class="matrix-box magenta-border">
              <span class="matrix-lbl cyan">CURRENT_BALANCE</span>
              <span class="matrix-val" :class="selectedPartner.debt > 0 ? 'yellow' : 'magenta'">
                {{ selectedPartner.debt > 0 ? '+' : '' }}{{ (selectedPartner.debt || 0).toLocaleString() }} <small>CR</small>
              </span>
            </div>
          </div>

          <!-- Repayment Control Bar (If negative debt exists) -->
          <div v-if="selectedPartner.debt < 0" class="repayment-bar-box">
            <div class="repayment-hdr-row">
              <span class="cyan">DEBT_REPAYMENT_SLIDER:</span>
              <span class="yellow">{{ Math.ceil(repaymentAmounts[selectedPartner.id] || 0).toLocaleString() }} CR</span>
            </div>
            <input type="range" class="os-range" min="0" :max="-selectedPartner.debt" step="1" 
              v-model.number="repaymentAmounts[selectedPartner.id]">
            <button class="btn-repay-solid" 
              :disabled="(repaymentAmounts[selectedPartner.id] || 0) <= 0"
              @click="sendDebtRepayment(selectedPartner, repaymentAmounts[selectedPartner.id] || 0)">
              EXECUTE_REPAYMENT // {{ Math.ceil(repaymentAmounts[selectedPartner.id] || 0).toLocaleString() }} CR
            </button>
          </div>

          <!-- CONTRACT PROTOCOLS PANEL -->
          <div class="contracts-console-panel">
            <div class="panel-sec-title cyan">// CONTRACT_PROTOCOLS_ENGAGEMENT</div>

            <div class="contracts-cards-grid">
              <div v-for="contract in selectedPartner.contracts" :key="contract.type" class="contract-card">
                <div class="contract-card-hdr">
                  <span class="contract-name yellow">▶ {{ contract.type }}</span>
                  <span class="contract-status-badge" :class="{ active: contract.active }">
                    {{ contract.active ? 'ACTIVE // SIGNED' : 'NOT_SIGNED' }}
                  </span>
                </div>

                <p class="contract-desc-text">
                  {{ getLocalizedText(CONTRACT_TYPE_DESC[contract.type], CONTRACT_TYPE_DESC_FIELD.DESC) }}
                </p>

                <!-- Ratio Slider for Benefit Share & Collusion -->
                <div v-if="[CONTRACT_TYPE.BENEFIT_SHARE, CONTRACT_TYPE.COLLUSION].includes(contract.type)" class="ratio-control-block">
                  <div class="ratio-label-row">
                    <span>PARTNER: {{ Math.round((contract.ratio || 0.5) * 10) * 10 }}%</span>
                    <span>YOU: {{ Math.round((1 - (contract.ratio || 0.5)) * 10) * 10 }}%</span>
                  </div>
                  <input type="range" class="os-range" min="0.1" max="0.9" step="0.1" 
                    :disabled="contract.active" v-model.number="contract.ratio">
                </div>

                <!-- Action Button Row (Pure Rectangles, No Slants) -->
                <div class="contract-btn-row">
                  <button class="btn-sign-rect" 
                    :disabled="contract.active || (selectedPartner.relationship || 0) < (contract.requiredRelationship || 0)"
                    @click="signContractFunc(selectedPartner.id, contract.type, contract.ratio || 0.5, selectedPartner, contract)">
                    {{ contract.active ? 'ACTIVE_CONTRACT' : 'SIGN_CONTRACT ➔' }}
                  </button>

                  <button class="btn-cancel-rect" 
                    :disabled="!contract.active"
                    @click="breakContractFunc(selectedPartner.id, contract.type)">
                    TERMINATE
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Companion Gift Action -->
          <div class="gift-action-footer">
            <button class="btn-gift-olive" @click="giftOliveBranch(selectedPartner)">
              SEND_OLIVE_BRANCH // BOOST_PARTNER_AFFINITY
            </button>
          </div>
        </main>
      </div>

      <div v-else class="empty-partner-panel">
        <h2 class="magenta">NO_ACTIVE_PARTNER_CONTRACTS</h2>
        <p class="cyan">Recruit companions in the underground sectors or black market to activate network sync.</p>
      </div>
    </div>
  </TerminalLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, getLocalizedText } from '../logic/store';
import { debtRepayment, getJoinedPartners } from '../logic/partnerSystem';
import { signContract, breakContract, CONTRACT_TYPE_DESC, CONTRACT_TYPE_DESC_FIELD } from '../logic/partnerContractSystem';
import { CONTRACT_TYPE } from '../logic/constants.js';
import { CLASSES_PARTNER } from '../logic/persona.js';
import { audioManager } from '../logic/audioManager';
import TerminalLayout from './TerminalLayout.vue';

defineEmits(['back']);

const partners = computed(() => getJoinedPartners());
const selectedPartnerId = ref(partners.value.length > 0 ? partners.value[0].id : null);
const repaymentAmounts = ref({});

const selectedPartner = computed(() => {
  return partners.value.find(p => p.id === selectedPartnerId.value) || partners.value[0] || null;
});

const getPartnerIndex = (id) => {
  const idx = partners.value.findIndex(p => p.id === id);
  return idx >= 0 ? idx + 1 : 1;
};

const selectPartner = (id) => {
  selectedPartnerId.value = id;
  audioManager.playSFX('ui-click');
};

const giftOliveBranch = (partner) => {
  if (partner) {
    partner.relationship = Math.min(100, (partner.relationship || 0) + 15);
    audioManager.playSFX('coin-throw');
  }
};

const sendDebtRepayment = (partner, amount) => {
  if (!partner || amount <= 0) return;
  debtRepayment(partner.id, amount);
  repaymentAmounts.value[partner.id] = 0;
  audioManager.playSFX('coin-throw');
};

const signContractFunc = (partnerId, type, ratio = 0.5, partner, contract) => {
  audioManager.playSFX('ui-click');
  signContract(partnerId, type, ratio);
};

const breakContractFunc = (partnerId, type) => {
  audioManager.playSFX('ui-click');
  breakContract(partnerId, type);
};
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';
@import '../assets/css/theme-os.css';

.cyan { color: var(--neon-cyan) !important; }
.yellow { color: var(--neon-yellow) !important; }
.magenta { color: var(--neon-magenta) !important; }

.partner-net-viewport {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 3.5rem;
  max-width: 1650px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.title-block {
  position: relative;
  display: flex;
  flex-direction: column;
}

.title-watermark {
  position: absolute;
  top: -20px;
  left: -10px;
  font-size: 5rem;
  font-weight: 900;
  color: rgba(0, 240, 255, 0.04);
  letter-spacing: 0.1em;
  pointer-events: none;
  user-select: none;
}

.hero-title {
  font-size: clamp(2.2rem, 5.5vw, 4rem);
  font-weight: 900;
  margin: 0;
  color: #ffffff;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 1;
}

.yellow-dot { color: var(--neon-yellow); }

.sub-syslog {
  font-size: 0.85rem;
  font-weight: 800;
  margin-top: 0.3rem;
  letter-spacing: 0.1em;
  position: relative;
  z-index: 1;
}

/* Master-Detail Split Console Layout (30% / 70%) */
.master-detail-console {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2.2rem;
  align-items: start;
}

/* LEFT: Master Index Station */
.master-index-station {
  background: rgba(8, 12, 16, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.station-hdr {
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.partner-index-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.index-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.15);
  padding: 1.4rem;
  cursor: pointer;
  border-radius: 0px;
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.index-card:hover {
  border-color: var(--neon-cyan);
  transform: translateX(5px);
}

.index-card.active {
  border-color: var(--neon-yellow);
  background: var(--neon-yellow);
  box-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
}

.index-card.active .index-num,
.index-card.active .index-name,
.index-card.active .index-sub,
.index-card.active .index-affinity {
  color: #000000 !important;
}

.index-num {
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--neon-cyan);
  line-height: 1;
}

.index-body {
  flex: 1;
  margin: 0 1rem;
}

.index-name {
  font-size: 1.35rem;
  font-weight: 900;
  margin: 0;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.index-sub {
  font-size: 0.78rem;
  font-weight: 800;
}

.index-affinity {
  font-size: 1.1rem;
  font-weight: 900;
}

/* RIGHT: Detail Control Terminal Panel */
.detail-control-station {
  position: relative;
  background: rgba(8, 12, 16, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.25);
  padding: 2.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  max-height: 76vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.partner-watermark-bg {
  position: absolute;
  top: 0;
  right: -20px;
  font-size: 12rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.02);
  letter-spacing: -0.05em;
  pointer-events: none;
  user-select: none;
  line-height: 0.8;
}

.panel-hdr-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 2px solid rgba(0, 240, 255, 0.2);
  padding-bottom: 1.2rem;
  position: relative;
  z-index: 1;
}

.identity-tag {
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.selected-name {
  font-size: clamp(2.5rem, 5vw, 3.8rem);
  font-weight: 900;
  margin: 0.2rem 0;
  color: #ffffff;
  line-height: 1;
  letter-spacing: -0.02em;
}

.philosophy-tag {
  font-size: 0.85rem;
  font-weight: 800;
  display: block;
  letter-spacing: 0.05em;
}

.affinity-gauge-box {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.affinity-lbl-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  font-weight: 900;
}

.gauge-track {
  height: 10px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.gauge-fill {
  height: 100%;
  background: var(--neon-yellow);
  box-shadow: 0 0 12px rgba(204, 255, 0, 0.6);
}

.partner-bio-box {
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.15);
  padding: 1.4rem;
  position: relative;
  z-index: 1;
}

.bio-hdr {
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  margin-bottom: 0.4rem;
}

.bio-text {
  font-size: 1rem;
  color: #d0e0f0;
  line-height: 1.5;
  margin: 0;
}

/* Financial Matrix */
.financial-matrix-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

.matrix-box {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 240, 255, 0.15);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.matrix-box.yellow-border {
  border-left: 4px solid var(--neon-yellow);
}

.matrix-box.magenta-border {
  border-left: 4px solid var(--neon-magenta);
}

.matrix-lbl {
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.matrix-val {
  font-size: 2rem;
  font-weight: 900;
}

/* Repayment Bar */
.repayment-bar-box {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: relative;
  z-index: 1;
}

.repayment-hdr-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 900;
}

.btn-repay-solid {
  background: var(--neon-cyan);
  border: 1px solid var(--neon-cyan);
  color: #000000;
  padding: 0.85rem;
  font-family: inherit;
  font-weight: 900;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 0px;
  transition: all 0.2s ease;
}

.btn-repay-solid:hover:not(:disabled) {
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
}

.btn-repay-solid:disabled {
  background: #1a222a;
  border-color: #1a222a;
  color: #405060;
  cursor: not-allowed;
}

/* Contracts Panel */
.contracts-console-panel {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
  z-index: 1;
}

.panel-sec-title {
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.contracts-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.4rem;
}

.contract-card {
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.15);
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.2rem;
  border-radius: 0px;
}

.contract-card-hdr {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  font-weight: 900;
}

.contract-status-badge {
  font-size: 0.78rem;
  color: #607080;
}

.contract-status-badge.active {
  color: var(--neon-yellow);
}

.contract-desc-text {
  font-size: 0.88rem;
  color: #8090a0;
  margin: 0;
  line-height: 1.4;
}

.ratio-control-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: rgba(0, 240, 255, 0.03);
  padding: 0.8rem;
  border: 1px solid rgba(0, 240, 255, 0.1);
}

.ratio-label-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  font-weight: 900;
  color: var(--neon-yellow);
}

.contract-btn-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.btn-sign-rect {
  background: var(--neon-yellow);
  border: 1px solid var(--neon-yellow);
  color: #000000;
  padding: 0.85rem;
  font-family: inherit;
  font-weight: 900;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 0px; /* 완전 직각 */
  transition: all 0.2s ease;
}

.btn-sign-rect:hover:not(:disabled) {
  box-shadow: 0 0 15px rgba(204, 255, 0, 0.5);
}

.btn-sign-rect:disabled {
  background: #1a222a;
  border-color: #1a222a;
  color: #405060;
  cursor: not-allowed;
}

.btn-cancel-rect {
  background: transparent;
  border: 1px solid var(--neon-magenta);
  color: var(--neon-magenta);
  padding: 0.85rem;
  font-family: inherit;
  font-weight: 900;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 0px; /* 완전 직각 */
  transition: all 0.2s ease;
}

.btn-cancel-rect:hover:not(:disabled) {
  background: var(--neon-magenta);
  color: #ffffff;
  box-shadow: 0 0 15px rgba(255, 0, 92, 0.5);
}

.btn-cancel-rect:disabled {
  border-color: #1a222a;
  color: #405060;
  cursor: not-allowed;
}

.os-range {
  width: 100%;
  accent-color: var(--neon-yellow);
  cursor: pointer;
}

.gift-action-footer {
  margin-top: 0.5rem;
  position: relative;
  z-index: 1;
}

.btn-gift-olive {
  background: transparent;
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  width: 100%;
  padding: 1rem;
  font-family: inherit;
  font-weight: 900;
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: 0px;
  transition: all 0.2s ease;
}

.btn-gift-olive:hover {
  background: var(--neon-cyan);
  color: #000000;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
}

.empty-partner-panel {
  padding: 5rem;
  text-align: center;
  border: 1px solid rgba(0, 240, 255, 0.15);
}

@media (max-width: 900px) {
  .master-detail-console {
    grid-template-columns: 1fr;
  }
}
</style>
