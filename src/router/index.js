import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import LinksPage from '../pages/LinksPage.vue'
import config from '../../config/index.js'

const isServer = typeof window === 'undefined';

const generateRoutes = (sidebar) => {
  return sidebar.map(item => ({
    path: item.link,
    component: LinksPage,
    props: {
      items: item.items || [],
      title: item.text
    }
  }))
}

const routes = generateRoutes(config.sidebar)

const router = createRouter({
  history: isServer ? createMemoryHistory() : createWebHistory(),
  routes,
})

export default router