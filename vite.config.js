// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist', // 确认输出目录
    rollupOptions: {
      input: 'public/index.html', // 指定入口文件
    },
  },
})
