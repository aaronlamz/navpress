<template>
  <aside>
    <ul>
      <li v-for="item in sidebar" :key="item.link">
        <a @click="navigate(item.children, item.text)">{{ item.text }}</a>
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
    navigate(children, title) {
      this.$emit('navigate', children, title)
      this.$router.push(title.toLowerCase())
    }
  }
}
</script>

<style>
/* 添加你的样式 */
</style>
