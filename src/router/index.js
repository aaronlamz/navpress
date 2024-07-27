import { createRouter, createMemoryHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import AboutPage from '../pages/AboutPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
]

const router = createRouter({
  history: createMemoryHistory(), // 使用 createMemoryHistory 以支持 SSR
  routes,
})

export default router
