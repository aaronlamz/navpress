<template>
  <nav class="bg-blue-600 p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-2xl font-bold">My Static Site Generator</div>
      <ul class="flex space-x-4">
        <li v-for="item in nav" :key="item.link">
          <router-link :to="item.link" class="text-white hover:text-gray-200">{{ item.text }}</router-link>
        </li>
      </ul>
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
  }
}
</script>

<style scoped>
/* 如果需要额外的样式，可以在这里添加 */
</style>
