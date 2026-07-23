<template>
  <TerminalLayout :show-back="true" @back="$emit('back')">
    <div class="black-market-viewport">
      
      <!-- 1. Top Title Header with Watermark & Telemetry Bar -->
      <div class="title-block">
        <div class="title-watermark font-orbitron">MARKET</div>
        <h1 class="hero-title font-orbitron">BLACK_MARKET<span class="yellow-dot">.</span></h1>
        
        <!-- Marathon Style FUI Symbol Decorator String -->
        <div class="fui-symbol-string font-orbitron">
          <span class="yellow glow-yellow">+ IIIIIIII X ⦿ 28 93 ⨉</span>
          <span class="dim">//</span>
          <span class="cyan">STICKY_CONTROL_MARKET / HARDWARE_PLUGINS_&_DEALER_INSPECTOR_NET</span>
        </div>

        <div class="sub-syslog cyan font-orbitron">
          <span>// DEALER_BROKER_ENCRYPTION_NET //</span>
          <span class="yellow glow-yellow">[BANKROLL: ${{ store.bankroll.toLocaleString() }}]</span>
          <span class="dim">|</span>
          <span class="pulse-neon-cyan">[STOCK_CYCLE: {{ formatTime(nextRefreshIn) }}]</span>
          <span class="dim">|</span>
          <span class="yellow glow-yellow">[BRIBE_LEVEL: LV.0{{ store.shop.manualRefreshCount }}]</span>
        </div>
      </div>

      <!-- 2. Dealer Speech Bubble Banner -->
      <div class="dealer-speech-banner fui-cctv-frame">
        <span class="subpanel-hdr cyan font-orbitron">[DEALER_BROKER_NET]:</span>
        <p class="dealer-speech-txt yellow font-orbitron">"{{ dealerMessage }}"</p>
      </div>

      <!-- 3. Sticky Controller Bar: Category Tabs + Bribe Dealer Refresh Button (Follows Scroll 100%) -->
      <div class="market-category-bar sticky-nav-bar">
        <div class="category-tabs-group">
          <button class="btn-category-tab font-orbitron instant-flash-btn" :class="{ active: selectedCategory === 'ALL' }" @click="selectedCategory = 'ALL'">
            ALL ({{ store.shop.items.length }})
          </button>
          <button class="btn-category-tab cyan font-orbitron instant-flash-btn" :class="{ active: selectedCategory === 'HARDWARE' }" @click="selectedCategory = 'HARDWARE'">
            ♣ HARDWARE
          </button>
          <button class="btn-category-tab yellow font-orbitron instant-flash-btn" :class="{ active: selectedCategory === 'CONTRACTS' }" @click="selectedCategory = 'CONTRACTS'">
            ♦ CONTRACTS
          </button>
          <button class="btn-category-tab magenta font-orbitron instant-flash-btn" :class="{ active: selectedCategory === 'GIFTS' }" @click="selectedCategory = 'GIFTS'">
            ♥ GIFTS
          </button>
          <button class="btn-category-tab cyan font-orbitron instant-flash-btn" :class="{ active: selectedCategory === 'KEYCARDS' }" @click="selectedCategory = 'KEYCARDS'">
            ♠ KEYCARDS
          </button>
        </div>

        <!-- Sticky Dealer Bribe Refresh Button Built-in -->
        <button class="target-lockon-btn cyan-solid sticky-bribe-btn font-orbitron instant-flash-btn" 
          :disabled="!canRefresh()" 
          @click="handleManualRefresh">
          <span class="btn-txt-layer">[ $ BRIBE_DEALER (${{ getCost().toLocaleString() }}) ] ➔</span>
        </button>
      </div>

      <!-- 4. 1-Column Accordion Item List (Governance Standard 5.1 - Unfold to reveal details & buy button) -->
      <div class="accordion-card-list" v-if="filteredItems.length > 0">
        <div v-for="(item, idx) in filteredItems" :key="item.instanceId" 
          class="accordion-card-item" 
          :class="{ unfolded: expandedItemId === item.instanceId, 'cant-afford': store.bankroll < item.price }">
          
          <!-- Card Header Bar (Click to Fold / Unfold) -->
          <div class="card-header-bar instant-flash-btn" @click="toggleAccordion(item.instanceId)">
            <span class="card-num">0{{ idx + 1 }} //</span>
            
            <div class="card-title-group">
              <div class="name-row">
                <h2 class="card-main-title">{{ getItemName(item) }}</h2>
                <span class="tier-tag">TIER_0{{ item.tier || 1 }}</span>
                <span class="class-badge cyan">[{{ getModuleSymbolData(item).code }}]</span>
              </div>
              <span class="deploy-status-line cyan">{{ getItemDesc(item) }}</span>
            </div>

            <div class="card-meta-right">
              <span class="card-price-val yellow font-orbitron">${{ item.price.toLocaleString() }} <small>CR</small></span>
              <span class="card-unfold-icon">{{ expandedItemId === item.instanceId ? '▲' : '▼' }}</span>
            </div>
          </div>

          <!-- Unfolded Detail Panel (Reveals Full Visual Lens, Specs & Built-in Purchase Button) -->
          <div class="card-unfold-content" v-if="expandedItemId === item.instanceId">
            <div class="unfold-inner-body">
              
              <div class="unfold-top-visual-row">
                <!-- Visual Lens -->
                <div class="visual-emoji-box">
                  <PixelGridEmoji 
                    :emoji="getModuleSymbolData(item).char" 
                    :base-color="getModuleSymbolData(item).baseColor"
                    :shadow-color="getModuleSymbolData(item).shadowColor"
                    :highlight-color="getModuleSymbolData(item).highlightColor"
                    :size="84" 
                  />
                </div>

                <!-- Detailed Specs -->
                <div class="unfold-specs-details">
                  <div class="spec-detail-hdr cyan font-orbitron">// HARDWARE_SPECS_INSPECTOR</div>
                  <p class="unfold-desc">{{ getItemDesc(item) }}</p>
                  
                  <div class="specs-tags-flex" v-if="item.effects && item.effects.length > 0">
                    <span class="spec-tag cyan font-orbitron">✦ QUANTUM_BUFF: {{ getEffectLabel(item.effects[0]) }}</span>
                    <span class="spec-tag yellow font-orbitron">✦ HARDWARE_SPECS: PERMANENT_SLOT_PLUGIN</span>
                  </div>
                </div>

                <!-- Built-in 1-Click Purchase Action Panel inside Unfolded Card -->
                <div class="unfold-buy-action-box">
                  <div class="buy-price-hero font-orbitron" :class="store.bankroll >= item.price ? 'yellow' : 'magenta'">
                    <span class="lbl cyan">TOTAL_PRICE</span>
                    <span class="val">${{ item.price.toLocaleString() }} <small>CR</small></span>
                  </div>

                  <button class="target-lockon-btn yellow-solid font-orbitron instant-flash-btn" 
                    :disabled="store.bankroll < item.price" 
                    @click="buyItem(item, idx)">
                    <span class="btn-txt-layer" v-if="store.bankroll >= item.price">[ 💰 PURCHASE_ITEM ] ➔</span>
                    <span class="btn-txt-layer magenta" v-else>INSUFFICIENT_FUNDS</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <!-- Empty Stock State -->
      <div v-else class="empty-stock fui-cctv-frame">
        <h2 class="magenta font-orbitron">// OUT_OF_STOCK // AWAITING_DEALER_RESTOCK</h2>
        <p class="dim">현재 입고된 희귀 밀수 품목이 없습니다. 딜러에게 비자금 뇌물을 송금하여 새 상품을 공급받으십시오.</p>
      </div>

    </div>
  </TerminalLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { store, getLanguage, gainBankroll } from '../logic/store.js';
import { canManualRefresh, getRefreshCost, refreshShop } from '../logic/shopLogic.js';
import { TYPE_CHANGE_BANKROLL, ITEM_EFFECT_ID } from '../logic/constants.js';
import { audioManager } from '../logic/audioManager.js';
import TerminalLayout from './TerminalLayout.vue';
import PixelGridEmoji from './PixelGridEmoji.vue';

defineEmits(['back']);

const nextRefreshIn = ref(0);
const selectedCategory = ref('ALL');
const expandedItemId = ref(null);
let timer = null;

const dealerMessage = computed(() => {
  const isKo = getLanguage() === 'ko';
  if (store.shop.manualRefreshCount === 0) {
    return isKo ? "신선한 퀀텀 하드웨어 밀수품이 입고되었다. 필요한 게 있으면 바로 가져가라." : "Fresh smuggled quantum hardware just arrived. Grab what you need.";
  } else if (store.shop.manualRefreshCount < 3) {
    return isKo ? "뇌물이 좀 모이는군... 더 귀한 전술 아이템 및 암호 키카드를 풀어주지." : "Bribes are stacking... decrypting higher tier tactical keys.";
  } else {
    return isKo ? "최고 등급 암호키까지 전부 개봉했다. 최고의 딜이다." : "All top-tier encryption keys unlocked. Deal at your own risk.";
  }
});

const filteredItems = computed(() => {
  const items = store.shop.items || [];
  if (selectedCategory.value === 'ALL') return items;
  return items.filter(item => {
    const typeStr = String(item.type || '').toUpperCase();
    if (selectedCategory.value === 'HARDWARE') return typeStr.includes('HARDWARE') || typeStr.includes('BATTERY');
    if (selectedCategory.value === 'CONTRACTS') return typeStr.includes('ACTIVE') || typeStr.includes('CONTRACT');
    if (selectedCategory.value === 'GIFTS') return typeStr.includes('CONSUMABLE') || typeStr.includes('GIFT');
    if (selectedCategory.value === 'KEYCARDS') return typeStr.includes('JOKER') || typeStr.includes('TACTICAL') || typeStr.includes('KEY');
    return true;
  });
});

watch(filteredItems, (newItems) => {
  if (newItems.length > 0 && (!expandedItemId.value || !newItems.find(i => i.instanceId === expandedItemId.value))) {
    expandedItemId.value = newItems[0].instanceId;
  }
}, { immediate: true });

const toggleAccordion = (id) => {
  audioManager.playSFX('ui-click');
  expandedItemId.value = expandedItemId.value === id ? null : id;
};

const getItemName = (item) => {
  const isKo = getLanguage() === 'ko';
  return isKo ? (item.name_ko || item.name) : (item.name_en || item.name);
};

const getItemDesc = (item) => {
  const isKo = getLanguage() === 'ko';
  return isKo ? (item.desc_ko || item.desc) : (item.desc_en || item.desc);
};

const getModuleSymbolData = (item) => {
  if (!item) return { code: 'HARDWARE', char: '♣', baseColor: '#ffffff', shadowColor: '#666666', highlightColor: '#ffffff' };
  const typeStr = String(item.type || '').toUpperCase();
  if (typeStr.includes('JOKER') || typeStr.includes('TACTICAL')) {
    return { code: 'KEYCARD', char: '♠', baseColor: '#00f0ff', shadowColor: '#006680', highlightColor: '#80f8ff' };
  } else if (typeStr.includes('ACTIVE')) {
    return { code: 'CONTRACT', char: '♦', baseColor: '#ff005c', shadowColor: '#80002e', highlightColor: '#ff80ae' };
  } else if (typeStr.includes('BATTERY') || typeStr.includes('CONSUMABLE')) {
    return { code: 'GIFT', char: '♥', baseColor: '#ccff00', shadowColor: '#668000', highlightColor: '#e6ff80' };
  } else {
    return { code: 'HARDWARE', char: '♣', baseColor: '#ffffff', shadowColor: '#666666', highlightColor: '#ffffff' };
  }
};

const getEffectLabel = (effectId) => {
  switch (effectId) {
    case ITEM_EFFECT_ID.XP_BOOST: return 'EXP_GAIN +25%';
    case ITEM_EFFECT_ID.BANKROLL_PROTECT: return 'BANKROLL_SHIELD';
    case ITEM_EFFECT_ID.STAMINA_RECOVERY: return 'STAMINA_RECOVERY';
    case ITEM_EFFECT_ID.BLUFF_DETECTOR: return 'BLUFF_DETECTOR';
    default: return 'QUANTUM_BUFF';
  }
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const updateTimer = () => {
  if (store.shop && store.shop.lastRefreshTime) {
    const nextTime = store.shop.lastRefreshTime + (12 * 60 * 60 * 1000);
    const diff = Math.max(0, Math.floor((nextTime - store.gameTime) / 1000));
    nextRefreshIn.value = diff;
  }
};

const canRefresh = () => canManualRefresh();
const getCost = () => getRefreshCost();

const handleManualRefresh = () => {
  if (canRefresh()) {
    const success = refreshShop(true);
    if (success) {
      audioManager.playSFX('coin-throw');
    } else {
      audioManager.playSFX('error');
    }
  }
};

const buyItem = (item, idx) => {
  if (store.bankroll >= item.price) {
    gainBankroll(-item.price, TYPE_CHANGE_BANKROLL.BUY_ITEM);
    store.inventory = store.inventory || [];
    store.inventory.push(item);
    store.shop.items.splice(idx, 1);
    audioManager.playSFX('paybill');
    expandedItemId.value = store.shop.items[0]?.instanceId || null;
  } else {
    audioManager.playSFX('error');
  }
};

onMounted(() => {
  updateTimer();
  timer = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
@import '../assets/fonts/pretendard-std.css';
@import '../assets/css/theme-os.css';

.cyan { color: var(--neon-cyan) !important; }
.yellow { color: var(--neon-yellow) !important; }
.magenta { color: var(--neon-magenta) !important; }
.dim { color: #506070; }

.black-market-viewport {
  padding: 1.5rem 4rem;
  max-width: 1350px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.title-block {
  position: relative;
  margin-bottom: 1.2rem;
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
  user-select: none;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 900;
  margin: 0;
  color: #ffffff;
}

.sub-syslog {
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Dealer Speech Banner */
.dealer-speech-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #000000;
  padding: 0.8rem 1.4rem;
  margin-bottom: 1.2rem;
}

.subpanel-hdr { font-size: 0.78rem; font-weight: 900; }
.dealer-speech-txt { font-size: 0.85rem; margin: 0; }

/* Sticky Controller Bar (Category Tabs + Dealer Bribe Refresh Button, Follows Scroll 100%) */
.market-category-bar.sticky-nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(4, 8, 12, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(0, 240, 255, 0.25);
  padding: 0.8rem 0rem;
  margin-bottom: 1.4rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.category-tabs-group {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.btn-category-tab {
  background: transparent;
  border: none;
  color: #8090a0;
  padding: 0.45rem 0.9rem;
  font-size: 0.78rem;
  font-weight: 900;
  cursor: pointer;
  border-radius: 0px;
  transition: all 0.2s ease;
}

.btn-category-tab.active { background: var(--neon-cyan); color: #000000 !important; }
.btn-category-tab.yellow.active { background: var(--neon-yellow); color: #000000 !important; }
.btn-category-tab.magenta.active { background: var(--neon-magenta); color: #ffffff !important; }

.sticky-bribe-btn {
  padding: 0.5rem 1rem !important;
  font-size: 0.8rem !important;
  white-space: nowrap;
}

/* 1-Column Accordion Item List (Governance Standard 5.1) */
.accordion-card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.accordion-card-item {
  background: rgba(8, 12, 16, 0.95);
  transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden;
}

.card-header-bar {
  display: flex;
  align-items: center;
  padding: 1.2rem 2rem;
  cursor: pointer;
}

.card-num {
  font-size: 1.4rem;
  font-weight: 900;
  color: #405060;
  width: 70px;
}

.card-title-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.card-main-title {
  font-size: 1.4rem;
  font-weight: 900;
  margin: 0;
  color: #ffffff;
}

.tier-tag { font-size: 0.75rem; font-weight: 900; border: 1px solid var(--neon-yellow); padding: 0.1rem 0.4rem; }
.class-badge { font-size: 0.75rem; font-weight: 900; }
.deploy-status-line { font-size: 0.8rem; margin-top: 0.1rem; }

.card-meta-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.card-price-val { font-size: 1.4rem; font-weight: 900; }
.card-price-val small { font-size: 0.75rem; }
.card-unfold-icon { font-size: 1.1rem; color: #405060; }

.accordion-card-item.unfolded .card-header-bar {
  background: var(--neon-yellow);
}

.accordion-card-item.unfolded .card-num,
.accordion-card-item.unfolded .card-main-title,
.accordion-card-item.unfolded .tier-tag,
.accordion-card-item.unfolded .class-badge,
.accordion-card-item.unfolded .deploy-status-line,
.accordion-card-item.unfolded .card-price-val,
.accordion-card-item.unfolded .card-unfold-icon {
  color: #000000 !important;
}

/* Unfolded Detail Panel */
.card-unfold-content {
  background: #020406;
  border-top: 2px solid var(--neon-yellow);
  padding: 1.5rem 2rem;
  animation: unfoldDown 0.3s ease-out forwards;
}

.unfold-top-visual-row {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.visual-emoji-box {
  padding: 1rem;
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.2);
}

.unfold-specs-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.spec-detail-hdr { font-size: 0.78rem; font-weight: 900; }
.unfold-desc { font-size: 0.9rem; color: #d0e0f0; margin: 0; line-height: 1.4; }

.specs-tags-flex {
  display: flex;
  gap: 1rem;
  margin-top: 0.4rem;
}

.spec-tag { font-size: 0.78rem; font-weight: 900; }

.unfold-buy-action-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;
  min-width: 240px;
}

.buy-price-hero {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.buy-price-hero .lbl { font-size: 0.7rem; font-weight: 900; }
.buy-price-hero .val { font-size: 1.8rem; font-weight: 900; }

.target-lockon-btn {
  position: relative;
  background: var(--neon-yellow);
  border: none;
  color: #000000;
  padding: 0.9rem 1.4rem;
  font-weight: 900;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 100%;
}

.target-lockon-btn.cyan-solid { background: var(--neon-cyan); }
.target-lockon-btn.magenta-solid { background: var(--neon-magenta); color: #ffffff; }

.empty-stock {
  padding: 3rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

@keyframes unfoldDown {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1024px) {
  .black-market-viewport { padding: 1rem; }
  .dealer-speech-banner { flex-direction: column; align-items: stretch; }
  .unfold-top-visual-row { flex-direction: column; align-items: stretch; }
  .unfold-buy-action-box { align-items: stretch; }
}
</style>
