import {
  createRouter,
  createMemoryHistory,
  createWebHashHistory,
} from 'vue-router'
import LinksPage from '../pages/LinksPage.vue'

const isServer = typeof window === 'undefined'

// const generateRoutes = (sidebar) => {
//   return sidebar.map(item => ({
//     path: item.link,
//     component: LinksPage,
//     props: {
//       items: item.items || [],
//       title: item.text
//     }
//   }))
// }

// const routes = generateRoutes(__USER_CONFIG__.sidebar)

// const router = createRouter({
//   history: isServer ? createMemoryHistory() : createWebHashHistory(), // 使用 hash 模式
//   routes,
// })

// export default router

export function createRouterInstance(config) {
  const generateRoutes = (sidebar) => {
    return sidebar.map((item) => ({
      path: item.link,
      component: LinksPage,
      props: {
        items: item.items || [],
        title: item.text,
      },
    }))
  }

  const routes = generateRoutes(config.sidebar)
  const router = createRouter({
    history: isServer ? createMemoryHistory() : createWebHashHistory(),
    routes,
  })

  // 路由全局前置守卫，处理路径中的 %23 锚点编码问题
  router.beforeEach((to, from, next) => {
    // 检查路径中是否包含编码的 %23
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
