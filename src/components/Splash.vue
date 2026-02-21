<template>
  <div class="splash-container">
    <Transition name="splash-fade" mode="out-in" @after-leave="handleAfterLeave">
      <div v-if="currentStep === 1" key="vue" class="logo-box">
        <img src="../assets/image/logo-vue.svg" alt="Vue Logo" class="logo vue-logo" />
        <p class="brand-text">BUILT WITH VUE.JS</p>
      </div>
      <div v-else-if="currentStep === 2" key="antigravity" class="logo-box">
        <img src="../assets/image/logo-anti-gravity.webp" alt="Antigravity Logo" class="logo ag-logo" />
        <p class="brand-text">POWERED BY ANTIGRAVITY</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['finish']);
const currentStep = ref(0); // 0: Idle, 1: Vue, 2: Antigravity

onMounted(() => {
  // Start sequence
  setTimeout(() => {
    currentStep.value = 1;

    // Auto proceed to next step after some time
    setTimeout(() => {
      currentStep.value = 2;

      // Final transition to main menu
      setTimeout(() => {
        currentStep.value = 3; // Triggers leave for Antigravity
      }, 2500);
    }, 2500);
  }, 500);
});

const handleAfterLeave = () => {
  if (currentStep.value === 3) {
    emit('finish');
  }
};
</script>

<style scoped>
.splash-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.logo-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.logo {
  width: 200px;
  height: auto;
  filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.3));
  padding: 20px;
}

.vue-logo {
  width: 180px;
}

.ag-logo {
  width: 180px;
  border-radius: 20px;
}

.brand-text {
  color: #fff;
  font-family: 'Outfit', sans-serif;
  letter-spacing: 0.5rem;
  font-size: 1rem;
  opacity: 0.8;
  text-transform: uppercase;
}

/* Transitions */
.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 1s ease, transform 1s ease;
}

.splash-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.splash-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
