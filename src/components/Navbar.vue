<template>
  <nav class="bg-blue-600 dark:bg-gray-900 p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white dark:text-gray-100 text-2xl font-bold">My Static Site Generator</div>
      <ul class="flex space-x-4">
        <li v-for="item in nav" :key="item.link">
          <router-link :to="item.link" class="text-white dark:text-gray-300 hover:text-gray-200 dark:hover:text-gray-400">{{ item.text }}</router-link>
        </li>
      </ul>
      <button @click="toggleDarkMode" class="ml-4 text-white dark:text-gray-300">
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
    // 检查本地存储或系统设置来初始化暗黑模式
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
/* 如果需要额外的样式，可以在这里添加 */
</style>