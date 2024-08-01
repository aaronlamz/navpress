<template>
  <div class="p-8">
    <h1 class="text-4xl font-bold mb-4 dark:text-gray-100">{{ title }}</h1>
    <div v-for="group in items" :key="group.link" :id="group.link.substring(1)" class="mb-8">
      <h2 class="text-2xl font-semibold mb-2 dark:text-gray-200">{{ group.text }}</h2>
      <ul class="space-y-2">
        <li v-for="item in group.items" :key="item.link">
          <a :href="item.link" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">{{ item.text }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
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
  }
}
</script>

<style scoped>
/* 如果需要额外的样式，可以在这里添加 */
</style>