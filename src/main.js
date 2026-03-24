import { createSSRApp, createApp as createCSRApp, reactive } from 'vue'
import App from './App.vue'
import { createRouterInstance } from './router'
import './assets/style/index.css'

// 响应式配置对象（启动时在客户端拉取最新配置，避免刷新后回退旧值）
const userConfig = reactive({})

async function loadLatestConfig() {
  // 1. 开发环境：优先从开发服务器端点获取最新配置（确保刷新后也能拿到最新值）
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    // 尝试带 base 路径和不带 base 路径两种 URL
    const basePath = import.meta.env.BASE_URL || '/'
    const urls = [
      `${basePath}__navpress_config?t=${Date.now()}`,
      `/__navpress_config?t=${Date.now()}`,
    ]
    for (const url of urls) {
      try {
        const resp = await fetch(url)
        if (resp.ok) {
          const config = await resp.json()
          if (config && Object.keys(config).length > 0) {
            return config
          }
        }
      } catch (e) {
        // 端点不可用，继续尝试下一个
      }
    }
  }

  // 2. 使用构建期注入的内联配置（生产环境主要走这里）
  if (typeof window !== 'undefined' && window.__USER_CONFIG__) {
    return window.__USER_CONFIG__
  }

  // 3. 最后回退到默认配置
  return {
    title: 'NavPress',
    description: 'Static Site Generator',
    sidebar: [],
    urlFormat: 'query',
  }
}

// console debug removed for production-like cleanliness

export function createApp() {
  const app = createSSRApp(App)
  const router = createRouterInstance(userConfig)
  app.use(router)
  // 将配置挂载到全局
  app.config.globalProperties.$config = userConfig
  // 提供配置给组件使用 inject
  app.provide('$config', userConfig)
  return { app, router }
}

if (typeof window !== 'undefined') {
  let app
  let router

  const initializeApp = async () => {
    // 首次或刷新时拉取最新配置，避免回退
    if (!Object.keys(userConfig).length) {
      const latest = await loadLatestConfig()
      Object.assign(userConfig, latest)
    }

    // 清理之前的应用实例
    if (app) {
      app.unmount()
    }

    app = createCSRApp(App)
    router = createRouterInstance(userConfig)
    app.use(router)
    app.config.globalProperties.$config = userConfig
    app.provide('$config', userConfig)
    app.mount('#app')
  }

  initializeApp()

  // 监听 Vite 的自定义事件更新配置
  if (import.meta.hot) {
    // 监听配置更新事件
    import.meta.hot.on('config-updated', (newConfig) => {
      // console debug removed

      try {
        // 更新响应式配置对象
        Object.keys(userConfig).forEach((key) => {
          delete userConfig[key]
        })
        Object.assign(userConfig, newConfig)

        // console debug removed

        // 重新初始化应用
        initializeApp()
      } catch (error) {
        // console error removed
        // 如果更新失败，重新加载页面
        window.location.reload()
      }
    })

    // 不再强制整页 reload，改为仅依赖 config-updated 做增量更新

    // 监听 Vite 热更新错误
    import.meta.hot.on('error', (_error) => {
      // console error removed
      // 热更新出错时重新加载页面
      window.location.reload()
    })
  }
}
