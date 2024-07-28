<template>
  <aside class="bg-gray-200 w-64 min-h-screen p-4">
    <ul>
      <li v-for="item in sidebar" :key="item.link" class="mb-2">
        <router-link :to="item.link" class="text-gray-800 hover:text-gray-600">{{ item.text }}</router-link>
        <ul v-if="item.items" class="ml-4 mt-2 space-y-2">
          <li v-for="group in item.items" :key="group.link">
            <a @click="scrollTo(group.link)" class="text-gray-600 hover:text-gray-800">{{ group.text }}</a>
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
