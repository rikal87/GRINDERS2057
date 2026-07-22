<template>
  <TerminalLayout :show-back="true" @back="$emit('back')">
    <div class="black-market-viewport">
      
      <!-- Top Title Header with Watermark Style -->
      <div class="title-block">
        <div class="title-watermark">MARKET</div>
        <h1 class="hero-title">BLACK_MARKET<span class="yellow-dot">.</span></h1>
        <div class="sub-syslog cyan">// TEMPLATE_B: HARDWARE_PLUGINS_&_DEALER_TRANSACTION_NET</div>
      </div>

      <div class="market-main-layout">
        <!-- LEFT (380px): Dealer Net Comms Terminal (Messenger Style) -->
        <aside class="dealer-station">
          <div class="station-hdr cyan font-orbitron">// SECURE_DEALER_COMMS_NET</div>
          
          <!-- Messenger Shell -->
          <div class="messenger-shell">
            <div class="messenger-history os-scrollbar-custom">
              <div class="msg-bubble system">
                <span class="sender-tag cyan font-orbitron">[SYSTEM]:</span>
                <p class="msg-txt">SECURE LINE ESTABLISHED // NO LOGS RECORDED.</p>
              </div>
              <div class="msg-bubble dealer">
                <span class="sender-tag yellow font-orbitron">[DEALER_NET]:</span>
                <p class="msg-txt">"{{ dealerMessage }}"</p>
              </div>
            </div>
            <div class="messenger-input-mimic">
              <span class="cursor-prompt cyan font-orbitron">>&nbsp;</span>
              <span class="typing-placeholder font-orbitron">AWAITING_TRANSACTION_PROTOCOL...</span>
            </div>
          </div>

          <!-- Bribe & Cycle Controls -->
          <div class="bribe-controls">
            <div class="control-row">
              <span class="lbl cyan font-orbitron">STOCK_CYCLE:</span>
              <span class="val font-orbitron">{{ formatTime(nextRefreshIn) }}</span>
            </div>
            <div class="control-row">
              <span class="lbl cyan font-orbitron">BRIBE_LEVEL:</span>
              <span class="val yellow font-orbitron">{{ store.shop.manualRefreshCount }}</span>
            </div>
            
            <button class="btn-bribe-rect font-orbitron" :disabled="!canRefresh()" @click="handleManualRefresh">
              <span class="btn-txt">[ BRIBE_DEALER // REFRESH ] ➔</span>
              <span class="btn-cost yellow font-orbitron">{{ getCost().toLocaleString() }} CR</span>
            </button>
          </div>
        </aside>

        <!-- RIGHT: Flat Merch Grid (Brutalist Blocks, Polished Typography) -->
        <main class="merch-stage">
          <div class="merch-hdr cyan font-orbitron">// AVAILABLE_HARDWARE_&_ACCESS_KEYS [{{ store.shop.items.length }}_FOUND]</div>
          
          <div class="items-grid os-scrollbar-custom" v-if="store.shop.items.length > 0">
            <div v-for="(item, idx) in store.shop.items" :key="item.instanceId" 
              class="item-card" :class="{ 'special-offer': item.isSpecialOffer, 'cant-afford': store.bankroll < item.price }"
              @click="buyItem(item, idx)">
              
              <!-- Card Top Header with Sub-Class Hierarchy -->
              <div class="card-top">
                <span class="tier-badge yellow font-orbitron">TIER // {{ item.tier }}</span>
                <span class="type-tag cyan font-orbitron">CLASS // [{{ getModuleSymbolData(item).code }}]</span>
              </div>

              <div class="item-body">
                <!-- Reconstructed 32x32 High-Detail Pixel Grid Emoji Device -->
                <PixelGridEmoji 
                  :emoji="getModuleSymbolData(item).char" 
                  :base-color="getModuleSymbolData(item).baseColor"
                  :shadow-color="getModuleSymbolData(item).shadowColor"
                  :highlight-color="getModuleSymbolData(item).highlightColor"
                  :size="84" 
                />
                
                <h3 class="item-name font-orbitron">{{ getItemName(item) }}</h3>
                <p class="item-desc">{{ getItemDesc(item) }}</p>

                <!-- Key Feature Specs -->
                <div class="item-specs" v-if="item.effects && item.effects.length > 0">
                  <span class="spec-tag cyan font-orbitron">{{ getEffectLabel(item.effects[0]) }}</span>
                </div>
              </div>

              <!-- Card Action Bar -->
              <div class="card-footer">
                <div class="price-tag font-orbitron" :class="store.bankroll >= item.price ? 'yellow' : 'magenta'">
                  {{ item.price.toLocaleString() }} <span class="unit-txt">CR</span>
                </div>
                
                <button class="btn-buy-solid font-orbitron" :disabled="store.bankroll < item.price">
                  <span class="btn-txt-layer" v-if="store.bankroll >= item.price">[ BUY ] ➔</span>
                  <span class="btn-txt-layer" v-else>NO_FUNDS</span>
                </button>
              </div>

            </div>
          </div>

          <div v-else class="empty-stock">
            <h2 class="cyan font-orbitron">OUT_OF_STOCK // AWAITING_NEXT_CYCLE</h2>
          </div>
        </main>
      </div>

    </div>
  </TerminalLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { store, getLanguage, gainBankroll } from '../logic/store.js';
import { canManualRefresh, getRefreshCost, refreshShop } from '../logic/shopLogic.js';
import { TYPE_CHANGE_BANKROLL, ITEM_EFFECT_ID } from '../logic/constants.js';
import { audioManager } from '../logic/audioManager.js';
import TerminalLayout from './TerminalLayout.vue';
import PixelGridEmoji from './PixelGridEmoji.vue';

defineEmits(['back']);

const nextRefreshIn = ref(0);
let timer = null;

const dealerMessage = computed(() => {
  const isKo = getLanguage() === 'ko';
  if (store.shop.manualRefreshCount === 0) {
    return isKo ? "신선한 퀀텀 하드웨어가 입고되었다. 필요한 게 있으면 바로 가져가라." : "Fresh quantum hardware just arrived. Grab what you need.";
  } else if (store.shop.manualRefreshCount < 3) {
    return isKo ? "뇌물이 좀 모이는군... 더 귀한 전술 아이템 암호키를 풀어주지." : "Bribes are stacking... decrypting higher tier tactical keys.";
  } else {
    return isKo ? "최고 등급 암호키까지 전부 개봉했다. 최고의 딜이다." : "All top-tier encryption keys unlocked. Deal at your own risk.";
  }
});

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
    return { code: 'TACTICAL', char: '♠', baseColor: '#00f0ff', shadowColor: '#006680', highlightColor: '#80f8ff' };
  } else if (typeStr.includes('ACTIVE')) {
    return { code: 'ACTIVE', char: '♦', baseColor: '#ff005c', shadowColor: '#80002e', highlightColor: '#ff80ae' };
  } else if (typeStr.includes('BATTERY') || typeStr.includes('CONSUMABLE')) {
    return { code: 'BATTERY', char: '♥', baseColor: '#ccff00', shadowColor: '#668000', highlightColor: '#e6ff80' };
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

const canRefresh = () => {
  return canManualRefresh();
};

const getCost = () => {
  return getRefreshCost();
};

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

.font-orbitron {
  font-family: 'Orbitron', 'Pretendard Std', sans-serif !important;
}

.cyan { color: var(--neon-cyan) !important; }
.yellow { color: var(--neon-yellow) !important; }
.magenta { color: var(--neon-magenta) !important; }
.white { color: #ffffff !important; }

.black-market-viewport {
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

.market-main-layout {
  display: flex;
  gap: 2rem;
  height: 680px;
}

/* Left Dealer Station */
.dealer-station {
  width: 380px;
  background: rgba(4, 8, 12, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.station-hdr {
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.messenger-shell {
  flex: 1;
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.15);
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
}

.messenger-history {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.msg-bubble {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.sender-tag {
  font-size: 0.78rem;
  font-weight: 900;
}

.msg-txt {
  font-size: 0.92rem;
  color: #c0d4e8;
  margin: 0;
  line-height: 1.4;
}

.messenger-input-mimic {
  padding: 0.8rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(0, 240, 255, 0.15);
  display: flex;
  align-items: center;
  font-size: 0.78rem;
}

.typing-placeholder {
  color: #405060;
  font-weight: bold;
}

.bribe-controls {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.15);
  padding: 1rem;
}

.control-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  font-weight: 900;
}

.btn-bribe-rect {
  background: var(--neon-yellow);
  border: 1px solid var(--neon-yellow);
  color: #000000;
  padding: 0.8rem 1rem;
  font-weight: 900;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0px;
  box-shadow: 0 0 12px rgba(204, 255, 0, 0.3);
  transition: all 0.2s ease;
  margin-top: 0.4rem;
}

.btn-bribe-rect:hover:not(:disabled) {
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
}

.btn-bribe-rect:disabled {
  background: #1a222a;
  border-color: #1a222a;
  color: #405060;
  box-shadow: none;
  cursor: not-allowed;
}

/* Right Merch Stage */
.merch-stage {
  flex: 1;
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.25);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.merch-hdr {
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  margin-bottom: 1.2rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.2rem;
  overflow-y: auto;
  padding-right: 0.4rem;
}

.item-card {
  background: rgba(8, 12, 16, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.item-card:hover {
  border-color: var(--neon-yellow);
  box-shadow: 0 0 15px rgba(204, 255, 0, 0.2);
  transform: translateY(-2px);
}

.item-card.cant-afford {
  opacity: 0.65;
}

.card-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 900;
  margin-bottom: 0.8rem;
}

.item-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
  flex: 1;
}

.item-name {
  font-size: 1.15rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0;
}

.item-desc {
  font-size: 0.82rem;
  color: #b0c4d8;
  margin: 0;
  line-height: 1.3;
}

.item-specs {
  margin-top: 0.4rem;
}

.spec-tag {
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.2rem 0.5rem;
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid var(--neon-cyan);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(0, 240, 255, 0.12);
}

.price-tag {
  font-size: 1.1rem;
  font-weight: 900;
}

.unit-txt {
  font-size: 0.75rem;
  color: #8095aa;
}

.btn-buy-solid {
  background: var(--neon-yellow);
  border: 1px solid var(--neon-yellow);
  color: #000000 !important;
  font-weight: 900;
  font-size: 0.82rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0px;
  box-shadow: 0 0 10px rgba(204, 255, 0, 0.3);
  transition: all 0.2s ease;
}

.btn-buy-solid:hover:not(:disabled) {
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.6);
}

.btn-buy-solid:disabled {
  background: #1a222a;
  border-color: #1a222a;
  color: #405060 !important;
  box-shadow: none;
  cursor: not-allowed;
}

.empty-stock {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Mobile Responsive Media Queries */
@media screen and (max-width: 768px) {
  .black-market-viewport {
    padding: 1rem;
  }

  .market-main-layout {
    flex-direction: column;
    height: auto;
    gap: 1.2rem;
  }

  .dealer-station {
    width: 100%;
    box-sizing: border-box;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.8rem;
  }
}
</style>
