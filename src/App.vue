<template>
  <div id="app" class="dark:bg-gray-900 min-h-screen">
    <Navbar :nav="config.nav" />
    <div class="flex flex-col md:flex-row pt-16"> <!-- 使用 pt-16 而非 mt-16 -->
      <Sidebar :sidebar="config.sidebar" />
      <div class="content-container flex-1 p-6 dark:bg-gray-900">
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
.content-container {
  flex: 1;
  padding: 20px;
  background-color: white;
}
.dark .content-container {
  background-color: #1a202c;
}
</style>