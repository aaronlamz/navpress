import { createRouter, createMemoryHistory, createWebHashHistory } from 'vue-router'
import LinksPage from '../pages/LinksPage.vue'

const isServer = typeof window === 'undefined';

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
    return sidebar.map(item => ({
      path: item.link,
      component: LinksPage,
      props: {
        items: item.items || [],
        title: item.text
      }
    }));
  };

  const routes = generateRoutes(config.sidebar);

  return createRouter({
    history: isServer ? createMemoryHistory() : createWebHashHistory(), // 使用 hash 模式
    routes,
  });
}

