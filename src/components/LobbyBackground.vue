<template>
  <canvas ref="canvasRef" class="mesh-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
let animationFrameId = null;

// Grid settings
const gridSize = 40; // Space between nodes
const points = [];
let rows = 0;
let cols = 0;

const initGrid = (width, height) => {
  points.length = 0;
  cols = Math.ceil(width / gridSize) + 1;
  rows = Math.ceil(height / gridSize) + 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      points.push({
        x: c * gridSize,
        y: r * gridSize,
        baseX: c * gridSize,
        baseY: r * gridSize,
        offset: Math.random() * Math.PI * 2
      });
    }
  }
};

const resize = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initGrid(canvas.width, canvas.height);
};

const animate = (ctx, canvas) => {
  let time = 0;
  let globalTime = 0;

  const frame = () => {
    globalTime += 0.01;

    // Modulation: speed oscillates between roughly 0.005 and 0.04
    const rhythm = Math.sin(globalTime) * 0.5 + 0.5; // 0 to 1
    const speedFactor = 0.005 + rhythm * 0.035;

    time += speedFactor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update point positions
    points.forEach(p => {
      // Scale movement with rhythm
      const movementScale = 5 + rhythm * 10;
      const waveScale = 10 + rhythm * 20;

      const noiseX = Math.sin(time + p.offset + p.baseY * 0.005) * movementScale;
      const noiseY = Math.cos(time + p.offset + p.baseX * 0.005) * movementScale;
      const wave = Math.sin(time * 0.5 + p.baseX * 0.002 + p.baseY * 0.002) * waveScale;

      p.x = p.baseX + noiseX;
      p.y = p.baseY + noiseY + wave;
    });

    // Draw lines (Mesh)
    ctx.beginPath();
    // Opacity also breathes with the rhythm
    const opacity = 0.05 + rhythm * 0.15;
    ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
    ctx.lineWidth = 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const p = points[i];

        if (c < cols - 1) {
          const right = points[i + 1];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(right.x, right.y);
        }

        if (r < rows - 1) {
          const bottom = points[i + cols];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(bottom.x, bottom.y);
        }
      }
    }
    ctx.stroke();

    // Draw nodes (Intersections)
    const nodeOpacity = 0.1 + rhythm * 0.4;
    ctx.fillStyle = `rgba(0, 240, 255, ${nodeOpacity})`;
    points.forEach((p, i) => {
      if (i % 3 === 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        if (Math.random() > 0.995) {
          ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(0, 240, 255, ${nodeOpacity})`;
        }
      }
    });

    animationFrameId = requestAnimationFrame(frame);
  };

  frame();
};

onMounted(() => {
  if (canvasRef.value) {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');

    resize(canvas);
    window.addEventListener('resize', () => resize(canvas));
    animate(ctx, canvas);
  }
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('resize', () => resize(canvasRef.value));
});
</script>

<style scoped>
.mesh-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle at center, rgba(13, 18, 24, 0) 0%, rgba(5, 10, 14, 0.5) 100%);
}
</style>
