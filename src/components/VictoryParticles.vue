<template>
  <canvas ref="canvas" class="victory-particles"></canvas>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  active: Boolean
});

const canvas = ref(null);
let ctx = null;
let animationFrame = null;
let particles = [];

const resizeCheckbox = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
  }
};

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 20 + 10;
    this.speedX = Math.random() * 6 - 3;
    this.speedY = Math.random() * -15 - 5; // Initial burst up
    this.gravity = 0.5;
    this.color = Math.random() > 0.5 ? '#00f0ff' : '#ff003c'; // Cyan or Magenta
    this.text = Math.random() > 0.5 ? '1' : '0';
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5;
    this.life = 100;
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    this.life -= 1;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.rotation * Math.PI) / 180);
    context.fillStyle = this.color;
    context.globalAlpha = this.life / 100;
    context.font = `${this.size}px "JetBrains Mono"`;
    context.fillText(this.text, 0, 0);
    context.restore();
  }
}

const spawnParticles = () => {
  if (!canvas.value) return;
  const centerX = canvas.value.width / 2;
  const centerY = canvas.value.height / 2;

  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(centerX, centerY));
  }
};

const loop = () => {
  if (!ctx || !canvas.value) return;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(ctx);
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  if (particles.length > 0 || props.active) {
    animationFrame = requestAnimationFrame(loop);
  }
};

watch(() => props.active, (newVal) => {
  if (newVal) {
    spawnParticles();
    if (!animationFrame) loop();
  }
});

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
    resizeCheckbox();
    window.addEventListener('resize', resizeCheckbox);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCheckbox);
  if (animationFrame) cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.victory-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}
</style>
