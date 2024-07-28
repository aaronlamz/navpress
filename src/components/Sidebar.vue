<template>
  <aside>
    <ul>
      <li v-for="item in sidebar" :key="item.link">
        <router-link :to="item.link">{{ item.text }}</router-link>
        <ul v-if="item.items">
          <li v-for="group in item.items" :key="group.link">
            <a @click="scrollTo(group.link)">{{ group.text }}</a>
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

<style>
/* 添加你的样式 */
</style>
