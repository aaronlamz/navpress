import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import config from '../config/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function generateNavComponent(nav) {
  return `
<template>
  <nav class="bg-gray-800 p-4">
    <ul class="flex space-x-4">
      ${nav.map(item => `<li><a href="${item.link}" class="text-white">${item.text}</a></li>`).join('')}
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavComponent',
}
</script>

<style scoped>
</style>
  `
}

function generateSidebar(sidebar) {
  return `
<template>
  <aside class="bg-gray-200 w-64 min-h-screen p-4">
    <ul>
      ${sidebar.map(item => `<li class="mb-2"><router-link to="${item.link}" class="text-gray-800">${item.text}</router-link></li>`).join('')}
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
}
</script>

<style scoped>
</style>
  `
}

function generatePageContent(page) {
  return `
<template>
  <div>
    <NavComponent />
    <div class="flex">
      <Sidebar />
      <main class="flex-1 p-8">
        <h1 class="text-4xl font-bold mb-4">${page.title}</h1>
        <ul>
          ${page.links.map(link => `<li class="mb-2"><a href="${link.href}" class="text-blue-600">${link.text}</a></li>`).join('')}
        </ul>
      </main>
    </div>
  </div>
</template>

<script>
import NavComponent from '../components/NavComponent.vue'
import Sidebar from '../components/Sidebar.vue'

export default {
  name: '${page.name}',
  components: {
    NavComponent,
    Sidebar,
  },
}
</script>

<style scoped>
</style>
  `
}

const navComponentContent = generateNavComponent(config.nav)
const sidebarComponentContent = generateSidebar(config.sidebar)
const pages = [
  { name: 'HomePage', title: 'Home', links: config.nav.map(item => ({ href: item.link, text: item.text })) },
  { name: 'AboutPage', title: 'About', links: config.nav.map(item => ({ href: item.link, text: item.text })) },
]

fs.writeFileSync(path.resolve(__dirname, '../src/components/NavComponent.vue'), navComponentContent)
fs.writeFileSync(path.resolve(__dirname, '../src/components/Sidebar.vue'), sidebarComponentContent)

pages.forEach(page => {
  const pageContent = generatePageContent(page)
  fs.writeFileSync(path.resolve(__dirname, `../src/pages/${page.name}.vue`), pageContent)
})

console.log('Pages generated successfully.')
