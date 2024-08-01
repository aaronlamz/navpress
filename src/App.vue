<template>
  <div id="app" class="dark:bg-gray-900 min-h-screen">
    <Navbar :nav="config.nav" />
    <div class="flex">
      <Sidebar :sidebar="config.sidebar" />
      <div class="content flex-1 p-6 dark:bg-gray-900">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import config from '../config/index.js'

export default {
  components: {
    Navbar,
    Sidebar
  },
  data() {
    return {
      config
    }
  }
}
</script>

<style>
.flex {
  display: flex;
}
.content {
  flex: 1;
  padding: 20px;
  background-color: white;
}
.dark .content {
  background-color: #1a202c; /* 使用 Tailwind CSS 的深色背景颜色 */
}
</style>