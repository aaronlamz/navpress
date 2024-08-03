<template>
  <nav class="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50">
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
      <div class="text-xl font-semibold text-gray-900 dark:text-white">
        My Static Site Generator
      </div>
      <ul class="hidden md:flex space-x-6">
        <li v-for="item in nav" :key="item.link">
          <router-link :to="item.link" class="text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">{{ item.text }}</router-link>
        </li>
      </ul>
      <button @click="toggleDarkMode" class="ml-4 text-gray-900 dark:text-gray-300">
        <span v-if="isDarkMode">🌞</span>
        <span v-else>🌙</span>
      </button>
    </div>
  </nav>
</template>

<script>
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