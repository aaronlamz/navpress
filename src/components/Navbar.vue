<template>
  <nav class="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50">
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
      <div class="flex items-center">
        <img :src="config.logo" alt="Logo" class="h-10 w-auto mr-3" />
        <span class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ config.title }}
        </span>
      </div>
      <!-- <ul class="hidden md:flex space-x-6">
        <li v-for="item in nav" :key="item.link">
          <router-link :to="item.link" class="text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">{{ item.text }}</router-link>
        </li>
      </ul> -->
      <div class="flex items-center">
        <a v-if="config.github" :href="config.github" target="_blank" rel="noopener noreferrer" class="ml-4">
          <svg class="w-6 h-6 text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6V21.5c-3.3.7-4-1.6-4-1.6-.5-1.4-1.2-1.8-1.2-1.8-.9-.7.1-.7.1-.7 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.3-1.1.5-1.4-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.3 11.3 0 016 0c2.2-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.3.3.6.8.6 1.6v2.4c0 .4.2.7.8.6A12 12 0 0012 0"></path>
          </svg>
        </a>
        <button @click="toggleDarkMode" class="ml-4 text-gray-900 dark:text-gray-300">
          <span v-if="isDarkMode">🌞</span>
          <span v-else>🌙</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import config from '../../config/index.js';
export default {
  props: {
    nav: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDarkMode: false,
      config
    }
  },
  mounted() {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      document.documentElement.classList.toggle('dark', this.isDarkMode);
      localStorage.setItem('darkMode', this.isDarkMode);
    }
  }
}
</script>

<style scoped>
/* 添加需要的额外样式 */
</style>