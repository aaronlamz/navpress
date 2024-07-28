<template>
  <div id="app">
    <Navbar :nav="config.nav" />
    <div class="container">
      <Sidebar :sidebar="config.sidebar" />
      <div class="content">
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
.container {
  display: flex;
}
.content {
  flex: 1;
  padding: 20px;
}
</style>
