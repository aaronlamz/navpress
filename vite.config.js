import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


// 使用新的配置文件路径
const configPath = process.env.CONFIG_PATH || path.resolve(process.cwd(), 'navpress.config.js');

let userConfig = {};

try {
  userConfig = await import(configPath).then(module => module.default);
} catch (error) {
  console.error(`Failed to load config from ${configPath}`, error);
}
export default defineConfig({
  plugins: [vue()],
  define: {
    __USER_CONFIG__: JSON.stringify(userConfig)
  },
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
