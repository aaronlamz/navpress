<template>
  <nav class="bg-gray-800 p-4">
    <ul class="flex space-x-4">
      <li v-for="item in nav" :key="item.link">
        <router-link :to="item.link" class="text-white hover:text-gray-400">{{ item.text }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    nav: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
/* 如果需要额外的样式，可以在这里添加 */
</style>
