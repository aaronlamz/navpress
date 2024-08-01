<template>
  <aside class="bg-gray-100 dark:bg-gray-800 w-64 min-h-screen p-4 shadow-lg">
    <ul class="space-y-2">
      <li v-for="item in sidebar" :key="item.link">
        <router-link :to="item.link" class="block text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 p-2 rounded">{{ item.text }}</router-link>
        <ul v-if="item.items" class="ml-4 mt-2 space-y-2">
          <li v-for="group in item.items" :key="group.link">
            <a @click="scrollTo(group.link)" class="block text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded">{{ group.text }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  props: {
    sidebar: {
      type: Array,
      required: true
    }
  },
  methods: {
    scrollTo(groupLink) {
      const hash = groupLink.substring(1);
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
</script>

<style scoped>
/* 如果需要额外的样式，可以在这里添加 */
</style>