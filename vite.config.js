import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import commonjs from 'vite-plugin-commonjs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),commonjs()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      vue: 'vue/dist/vue.esm-bundler.js',
    }
  },
  optimizeDeps: {
    include: ['astronomy-engine'],
  },
  base: '/templewebsite/',
  build: {
    assetsDir: '.',
  }
})

