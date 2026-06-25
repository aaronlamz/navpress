<template>
  <div id="app" class="dark:bg-gray-900 min-h-screen flex flex-col">
    <Navbar :nav="$config.nav" @toggle-sidebar="toggleSidebar" />
    <div class="main-container flex flex-1 overflow-hidden">
      <!-- 动态显示侧边栏 -->
      <Sidebar
        :sidebar="$config.sidebar"
        :isSidebarOpen="isSidebarOpen"
        :class="{ show: isSidebarOpen }"
        class="sidebar-container"
        @close-sidebar="toggleSidebar"
        :toggleSidebar="toggleSidebar"
        :urlFormat="$config.urlFormat || 'query'"
        :sidebarExpand="$config.sidebarExpand || 'all'"
      />
      <div
        class="content-container flex-1 overflow-y-auto p-6"
        @click="closeSidebarOnContentClick"
      >
        <router-view />
        <FooterComponent />
      </div>
    </div>
    
    <!-- 开发模式下显示配置状态 -->
    <ConfigStatus v-if="isDevelopment" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import FooterComponent from './components/FooterComponent.vue'
import ConfigStatus from './components/ConfigStatus.vue'
import { ref, computed, inject, watchEffect } from 'vue'

// 把 #rgb / #rrggbb 解析成 "r, g, b"，供 rgba(var(--np-accent-rgb), a) 使用
function hexToRgbTriplet(hex) {
  if (typeof hex !== 'string') return null
  let h = hex.trim().replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return null
  const n = parseInt(h, 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

export default {
  components: {
    Navbar,
    Sidebar,
    FooterComponent,
    ConfigStatus,
  },
  setup() {
    const isSidebarOpen = ref(false)
    const config = inject('$config', {})

    // 根据配置应用主题预设(data-theme)与强调色(--np-accent)，配置变化时自动重应用
    watchEffect(() => {
      if (typeof document === 'undefined') return
      const root = document.documentElement
      const theme = config.theme || 'apple'
      if (theme && theme !== 'apple') root.setAttribute('data-theme', theme)
      else root.removeAttribute('data-theme')

      if (config.accent) {
        root.style.setProperty('--np-accent', config.accent)
        const rgb = hexToRgbTriplet(config.accent)
        if (rgb) root.style.setProperty('--np-accent-rgb', rgb)
      } else {
        root.style.removeProperty('--np-accent')
        root.style.removeProperty('--np-accent-rgb')
      }
    })

    // 判断是否为开发模式
    const isDevelopment = computed(() => {
      return import.meta.env.DEV || import.meta.env.MODE === 'development'
    })

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value
    }

    const closeSidebarOnContentClick = () => {
      if (isSidebarOpen.value) {
        isSidebarOpen.value = false
      }
    }

    return { 
      isSidebarOpen, 
      toggleSidebar, 
      closeSidebarOnContentClick,
      isDevelopment
    }
  },
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--np-bg);
}

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}

.main-container {
  margin-top: 3.5rem;
  height: calc(100vh - 3.5rem);
  display: flex;
}

.sidebar-container {
  width: 260px;
  overflow-y: auto;
  transition: transform 0.3s ease;
  background: transparent;
}

.content-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: transparent;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .sidebar-container {
    position: fixed;
    top: 3.5rem;
    left: 0;
    width: 100%;
    height: calc(100vh - 3.5rem);
    transform: translateX(-100%);
    z-index: 40;
  }

  .sidebar-container.show {
    transform: translateX(0);
  }
}
</style>