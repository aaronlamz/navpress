import { createSSRApp, createApp as createCSRApp } from 'vue'
import App from './App.vue'
import router from './router/index.js' // 明确导入文件
import './assets/style/index.css'

// 获取全局配置
const config = typeof __USER_CONFIG__ !== 'undefined' ? __USER_CONFIG__ : {};


export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
  // 将配置挂载到全局
  app.config.globalProperties.$config = config;
  return { app, router }
}

if (typeof window !== 'undefined') {
  const app = createCSRApp(App)
  app.use(router)
  // 将配置挂载到全局
  app.config.globalProperties.$config = config;
  app.mount('#app')
}
