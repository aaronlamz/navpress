import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // 指向根目录中的 index.html
    },
  },
  server: {
    open: true,  // 自动在浏览器中打开
  },
})
