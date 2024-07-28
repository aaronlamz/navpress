<template>
    <div>
      <h1>{{ title }}</h1>
      <div v-for="group in children" :key="group.group">
        <h2>{{ group.group }}</h2>
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
      children: {
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
  