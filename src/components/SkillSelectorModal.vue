<template>
  <transition name="v4-fade">
    <div v-if="show" class="v5-modal-overlay" @click.self="$emit('close')">
      <div class="v5-modal">
        <div class="v4-label">SELECT_SUBROUTINE: {{ activeSlotType }}</div>
        <div class="v5-modal-list">
          <div v-for="sk in filteredSkillsForSlot" :key="sk.id" class="v4-item-card" @click="equipSkill(sk)">
            <div class="v4-item-row">
              <span class="v4-val white">{{ sk.name }}</span>
              <span class="v4-val yellow">{{ sk.tier }}</span>
            </div>
            <div class="v4-key">{{ sk.desc }}</div>
            <div class="v4-key" style="opacity:0.4;">RAM: {{ sk.ramOccupation }}GB</div>
          </div>
        </div>
        <div class="v4-modal-footer" style="display:flex; gap:10px; margin-top:20px">
          <button class="v4-btn red" @click="equipSkill(null)">DE_ATTACH</button>
          <button class="v4-btn" @click="$emit('close')">CANCEL</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../logic/store';
import { SKILL_DATA } from '../logic/skills';
import { audioManager } from '../logic/audioManager';

const props = defineProps({
  show: Boolean,
  activeSlotIdx: Number,
  activeSlotType: String
});

const emit = defineEmits(['close']);

const filteredSkillsForSlot = computed(() => {
  if (!props.activeSlotType) return [];
  const type = props.activeSlotType;
  return SKILL_DATA.filter(sk => {
    if (type === 'ULT') return true;
    const slotTier = parseInt(type.substring(1));
    const skTier = sk.tier === 'ULT' ? 99 : parseInt(sk.tier.substring(1));
    return skTier <= slotTier;
  });
});

const equipSkill = (skill) => {
  if (props.activeSlotIdx !== null) {
    store.equippedSkills[props.activeSlotIdx] = skill;
  }
  emit('close');
  audioManager.playSFX('action-confirm');
};
</script>

<style scoped>
@import '../styles/components/SafeHouse.css';

.v5-modal-overlay {
  z-index: 1000;
}
</style>
