<template>
  <div id="app">
    <Navbar :nav="config.nav" />
    <div class="container">
      <Sidebar :sidebar="config.sidebar" @navigate="handleNavigate" />
      <div class="content">
        <router-view :children="currentChildren" :title="currentTitle" />
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
      config,
      currentChildren: [],
      currentTitle: ''
    }
  },
  methods: {
    handleNavigate(children, title) {
      this.currentChildren = children
      this.currentTitle = title
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
