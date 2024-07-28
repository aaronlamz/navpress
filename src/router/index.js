import { createRouter, createWebHistory } from 'vue-router'
import Page from '../pages/LinksPage.vue'
import config from '../../config/index.js'

const generateRoutes = (sidebar) => {
  return sidebar.map(item => ({
    path: item.link,
    component: Page,
    props: {
      items: item.items || [],
      title: item.text
    }
  }))
}

const routes = generateRoutes(config.sidebar)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
