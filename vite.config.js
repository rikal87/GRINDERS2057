import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  clearScreen: false,
  base: './', // 반드시 './' (상대 경로)로 설정해야 합니다!
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    sourcemap: false,
  }
})
