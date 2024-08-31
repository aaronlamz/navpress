import { createSSRApp, createApp as createCSRApp, reactive } from 'vue'
import App from './App.vue'
import { createRouterInstance } from './router'
import './assets/style/index.css'

// 获取全局配置
const initialConfig =
  typeof __USER_CONFIG__ !== 'undefined' ? __USER_CONFIG__ : {}
const userConfig = reactive(initialConfig) // 使用 reactive 创建响应式的配置对象

console.log('Initial userConfig:', userConfig)

export function createApp() {
  const app = createSSRApp(App)
  const router = createRouterInstance(userConfig)
  app.use(router)
  // 将配置挂载到全局
  app.config.globalProperties.$config = userConfig
  return { app, router }
}

if (typeof window !== 'undefined') {
  let app
  let router

  const initializeApp = () => {
    app = createCSRApp(App)
    router = createRouterInstance(userConfig)
    app.use(router)
    // 将配置挂载到全局
    app.config.globalProperties.$config = userConfig
    app.mount('#app')
  }

  initializeApp()

  // 监听 Vite 的自定义事件更新配置
  if (import.meta.hot) {
    import.meta.hot.on('config-updated', (newConfig) => {
      Object.assign(userConfig, newConfig) // 更新响应式对象
      console.log('Config updated:', userConfig)
      app.unmount()
      initializeApp()
    })
  }
}
