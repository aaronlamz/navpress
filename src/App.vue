<template>
  <div id="app" class="dark:bg-gray-900 min-h-screen flex flex-col">
    <Navbar :nav="$config.nav" @toggle-sidebar="toggleSidebar" />
    <div class="main-container flex flex-1 overflow-hidden">
      <!-- 动态显示侧边栏 -->
      <Sidebar
        :sidebar="$config.sidebar"
        :isSidebarOpen="isSidebarOpen"
        :class="{ show: isSidebarOpen }"
        class="sidebar-container bg-gray-100 dark:bg-gray-800"
        @close-sidebar="toggleSidebar"
        :toggleSidebar="toggleSidebar"
        :urlFormat="$config.urlFormat || 'query'"
      />
      <div
        class="content-container flex-1 overflow-y-auto p-6 dark:bg-gray-900"
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
  height: 100vh; /* 保持应用高度为视口高度 */
}

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}

.main-container {
  margin-top: 4rem; /* 与导航栏高度一致，确保内容不被遮挡 */
  height: calc(100vh - 4rem); /* 内容区域高度 = 视口高度 - 导航栏高度 */
  display: flex;
}

.min-container-height {
  min-height: calc(100vh - 8rem);
}

.sidebar-container {
  width: 250px;
  overflow-y: auto; /* 确保侧边栏可滚动 */
  transition: transform 0.3s ease; /* 添加过渡动画 */
}

.content-container {
  flex: 1;
  overflow-y: auto; /* 使内容区域可滚动 */
  padding: 20px;
  background-color: white;
}

.dark .content-container {
  background-color: #1a202c;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .sidebar-container {
    position: fixed;
    top: 4rem; /* 与导航栏对齐 */
    left: 0;
    height: calc(100vh - 4rem); /* 高度 = 视口高度 - 导航栏高度 */
    transform: translateX(-100%); /* 初始隐藏 */
  }

  .sidebar-container.show {
    transform: translateX(0); /* 显示时移入屏幕 */
  }
}
</style>