import { createRouter, createMemoryHistory } from 'vue-router'
import LinksPage from '../pages/LinksPage.vue'
import config from '../../config/index.js'

const generateRoutes = (sidebar) => {
  return sidebar.map(item => ({
    path: item.link,
    component: LinksPage,
    props: {
      children: item.children || [],
      title: item.text
    }
  }))
}

const routes = generateRoutes(config.sidebar)

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
