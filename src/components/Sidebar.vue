<template>
  <aside class="bg-gray-100 dark:bg-gray-800 w-64 min-h-screen p-4 shadow-lg">
    <ul class="space-y-2">
      <li v-for="(item, index) in sidebar" :key="item.link">
        <div class="flex items-center cursor-pointer" @click="handleMenuClick(index, item.link)">
          <img v-if="item.icon" :src="item.icon" alt="" class="w-5 h-5 mr-2" />
          <i v-else class="fas fa-folder text-blue-500 w-5 h-5 mr-2"></i>
          <span class="block text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 p-2 rounded flex-1">{{ item.text }}</span>
          <i :class="expandedMenu[index] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-gray-500"></i>
        </div>
        <ul v-if="item.items && expandedMenu[index]" class="ml-7 mt-2 space-y-2">
          <li v-for="group in item.items" :key="group.link">
            <a @click="handleGroupClick(item.link, group.link)" class="block text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded flex items-center cursor-pointer">
              <img v-if="group.icon" :src="group.icon" alt="" class="w-4 h-4 mr-2" />
              <i v-else class="fas fa-folder-open text-gray-500 w-4 h-4 mr-2"></i>
              {{ group.text }}
            </a>
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
  data() {
    return {
      expandedMenu: {} // 用于跟踪每个主菜单项的展开状态
    }
  },
  methods: {
    toggleMenu(index) {
      this.expandedMenu[index] = !this.expandedMenu[index];
    },
    handleMenuClick(index, link) {
      this.toggleMenu(index);
      this.$router.push(link);
    },
    handleGroupClick(parentLink, groupLink) {
      // 拼接完整的路径
      const fullPath = `${parentLink}${groupLink}`;
      if (fullPath.startsWith('http')) {
        window.open(fullPath, '_blank'); // 外部链接用 window.open 打开新标签页
      } else {
        this.$router.push(fullPath); // 内部链接用 Vue Router 导航
      }
    }
  }
}
</script>

<style scoped>
/* 为子菜单项添加点击手势和视觉反馈 */
.cursor-pointer {
  cursor: pointer;
}
.hover\:bg-gray-200:hover {
  background-color: #e5e7eb; /* Tailwind CSS 的灰色200 */
}
.dark:hover\:bg-gray-600:hover {
  background-color: #4b5563; /* Tailwind CSS 的灰色600 */
}
</style>