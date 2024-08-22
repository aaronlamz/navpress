<template>
  <div id="app" class="dark:bg-gray-900 min-h-screen flex flex-col">
    <Navbar :nav="config.nav" />
    <div class="main-container flex flex-1 overflow-hidden">
      <Sidebar :sidebar="config.sidebar" class="sidebar-container bg-gray-100 dark:bg-gray-800" />
      <div class="content-container flex-1 overflow-y-auto p-6 dark:bg-gray-900">
        <router-view />
        <FooterComponent />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import FooterComponent from './components/FooterComponent.vue';

export default {
  components: {
    Navbar,
    Sidebar,
    FooterComponent
  },
  data() {
    return {
      config: __USER_CONFIG__
    }
  }
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
  margin-top: 4rem; /* 设置与导航栏相同的高度，确保内容不被遮挡 */
  height: calc(100vh - 4rem); /* 确保内容区域的总高度为视口高度减去导航栏的高度 */
  display: flex;
}
.min-container-height{
  min-height: calc(100vh - 8rem);
}

.sidebar-container {
  width: 250px;
  overflow-y: auto; /* 确保侧边栏可以滚动 */
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
</style>