<template>
  <nav>
    <ul>
      <li v-for="item in nav" :key="item.link">
        <router-link :to="item.link">{{ item.text }}</router-link>
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

<style>
/* 添加你的样式 */
</style>
