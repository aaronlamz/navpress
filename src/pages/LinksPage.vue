<template>
  <div class="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <h1 class="text-4xl font-bold mb-8 dark:text-white">{{ title }}</h1>
    <div class="space-y-12">
      <div v-for="group in items" :key="group.link" :id="group.link.substring(1)">
        <h2 class="text-2xl font-semibold mb-4 dark:text-gray-200">{{ group.text }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="item in group.items" :key="item.link" class="card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex items-center p-4 transition-transform transform hover:scale-105">
            <div class="flex-shrink-0">
              <img v-if="item.icon" :src="item.icon" alt="" class="w-10 h-10 mr-4" />
              <i v-else class="fas fa-folder text-green-500 w-10 h-10 mr-4"></i>
            </div>
            <a :href="item.link" target="_blank" class="block flex-1">
              <div class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ item.text }}</div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">{{ item.description || 'No description available.' }}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue';

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    $route(to) {
      this.scrollToAnchor(to.hash);
    }
  },
  mounted() {
    this.scrollToAnchor(this.$route.hash);
  },
  methods: {
    scrollToAnchor(hash) {
      if (hash) {
        nextTick(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    }
  }
}
</script>

<style scoped>
.card {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.card:hover {
  background-image: linear-gradient(135deg, #ff7e5f, #feb47b, #86a8e7, #7f7fd5);
  transform: scale(1.05);
}
</style>