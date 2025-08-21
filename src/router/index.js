import {
  createRouter,
  createMemoryHistory,
  createWebHashHistory,
} from 'vue-router'
import LinksPage from '../pages/LinksPage.vue'

const isServer = typeof window === 'undefined'

export function createRouterInstance(config) {
  const generateRoutes = (sidebar) => {
    const safeSidebar = Array.isArray(sidebar) ? sidebar : []
    const routes = safeSidebar.map((item) => ({
      path: item.link,
      component: LinksPage,
      props: {
        items: item.items || [],
        title: item.text,
      },
    }))

    // 如果配置了路径参数格式，添加动态路由
    if (config.urlFormat === 'path') {
      routes.push({
        path: '/:section',
        component: LinksPage,
        props: (route) => ({
          items: config.sidebar[0]?.items || [], // 默认使用第一个sidebar的items
          title: config.sidebar[0]?.text || '',
          section: route.params.section,
        }),
      })
    }

    return routes
  }

  const routes = generateRoutes(config?.sidebar)
  const router = createRouter({
    history: isServer ? createMemoryHistory() : createWebHashHistory(),
    routes,
  })

  // 路由全局前置守卫，根据URL格式处理路由（去除调试日志与不必要改写）
  router.beforeEach((to, from, next) => {
    const urlFormat = config.urlFormat || 'query'

    if (urlFormat === 'query') {
      // 查询参数格式：保持查询参数不变，由页面逻辑处理滚动
      next()
      return
    } else if (urlFormat === 'path') {
      // 路径参数格式：不需要特殊处理，路由已经配置
      next()
      return
    } else if (urlFormat === 'hash') {
      // 锚点格式：直接使用，不需要转换
      next()
      return
    }

    // 检查路径中是否包含编码的 %23 锚点编码问题
    if (to.path.includes('%23')) {
      // 解码路径
      const decodedPath = decodeURIComponent(to.path)
      // 替换掉 path 中的 %23 为正常的 #
      if (decodedPath !== to.path) {
        next({ ...to, path: decodedPath, replace: true })
      } else {
        next()
      }
    } else {
      next()
    }
  })

  return router
}
