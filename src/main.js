import { createSSRApp, createApp as createCSRApp } from 'vue'
import App from './App.vue'
import router from './router/index.js' // 明确导入文件
import './assets/style/index.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
  return { app, router }
}

if (typeof window !== 'undefined') {
  const app = createCSRApp(App)
  app.use(router)
  app.mount('#app')
}
