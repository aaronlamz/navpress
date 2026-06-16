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
import { ref, computed } from 'vue'

export default {
  components: {
    Navbar,
    Sidebar,
    FooterComponent,
    ConfigStatus,
  },
  setup() {
    const isSidebarOpen = ref(false)
    
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
  background: #f5f5f7;
}

.dark #app {
  background: #000000;
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