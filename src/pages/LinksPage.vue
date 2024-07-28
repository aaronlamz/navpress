<template>
    <div>
      <h1>{{ title }}</h1>
      <div v-for="group in items" :key="group.link" :id="group.link.substring(1)">
        <h2>{{ group.text }}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.link">
            <a :href="item.link" target="_blank">{{ item.text }}</a>
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
  
  <style>
  /* 添加你的样式 */
  </style>
  