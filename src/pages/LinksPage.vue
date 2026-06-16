<template>
  <div class="p-4 sm:p-8 min-h-screen">
    <h1 class="text-2xl sm:text-4xl font-bold mb-6 dark:text-white text-center sm:text-left">
      {{ title }}
    </h1>
    <div class="space-y-8">
      <div v-for="group in items" :key="group.link" :id="getGroupId(group.link)"
        class="group-container glass-card rounded-2xl p-5">
        <h2 class="text-lg sm:text-2xl font-semibold mb-4 dark:text-gray-200 flex items-center min-w-0">
          <span v-tooltip="group.text" class="mr-2 truncate">{{ group.text }}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 font-normal flex-shrink-0 whitespace-nowrap">
            ({{ group.items?.length || 0 }} 个项目)
          </span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="item in group.items" :key="item.link"
            class="card glass-link-card rounded-xl p-4 flex items-center gap-4 transition-all duration-200 overflow-hidden">
            <div class="w-10 h-10 flex-shrink-0 rounded-xl icon-container flex items-center justify-center">
              <img :src="item.icon || defaultLinkIcon" alt="" class="w-6 h-6" />
            </div>
            <a :href="item.link" target="_blank" class="flex-1 min-w-0 text-sm sm:text-base text-gray-800 dark:text-gray-200">
              <div v-tooltip="item.text" class="font-medium truncate">{{ item.text }}</div>
              <p v-tooltip="item.description || ''" class="text-gray-500 dark:text-gray-400 text-xs truncate">
                {{ item.description || 'No description available.' }}
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 滚动到顶部按钮 -->
    <button v-show="showScrollTop" @click="scrollToTop"
      class="fixed bottom-8 right-8 glass-fab p-3 rounded-2xl transition-all duration-300 z-50"
      title="回到顶部">
      <i class="fas fa-arrow-up"></i>
    </button>

    <!-- 开发模式下显示滚动调试信息 -->
    <!-- 调试浮层已移除 -->
  </div>
</template>

<script>
import { nextTick, ref, onMounted, onUnmounted } from 'vue'
import defaultLinkIcon from '../assets/icons/default-link.svg'

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  },
  setup() {
    const showScrollTop = ref(false)
    const scrollY = ref(0)
    const windowHeight = ref(0)
    const pageHeight = ref(0)
    const currentSection = ref('')
    const targetSection = ref('')
    const isDev = ref(false)

    const handleScroll = () => {
      showScrollTop.value = window.scrollY > 300
      scrollY.value = window.scrollY
      windowHeight.value = window.innerHeight
      pageHeight.value = document.documentElement.scrollHeight
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    // 强制滚动到顶部的方法
    const forceScrollToTop = () => {
      window.scrollTo(0, 0)
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      // 初始化滚动信息
      handleScroll()
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      showScrollTop,
      scrollToTop,
      forceScrollToTop,
      defaultLinkIcon,
      scrollY,
      windowHeight,
      pageHeight,
      currentSection,
      targetSection,
      isDev
    }
  },
  watch: {
    $route(to, from) {
      // debug removed

      // 如果是不同的页面，先滚动到顶部
      if (from.path !== to.path) {
        this.forceScrollToTop();
        // debug removed
      }

      // 延迟处理锚点滚动，确保页面先滚动到顶部
      setTimeout(() => {
        // 优先处理查询参数中的 section
        if (to.query.section) {
          // debug removed
          this.scrollToSection(to.query.section);
        } else if (to.params.section) {
          // 处理路径参数中的 section
          // debug removed
          this.scrollToSection(to.params.section);
        } else if (to.hash) {
          // 如果没有查询参数，则处理锚点
          // debug removed
          this.scrollToAnchor(to.hash);
        } else {
          // debug removed
        }
      }, 200);
    },
  },
  mounted() {
    // 组件挂载时，优先检查查询参数，然后是路径参数，最后是锚点
    // debug removed

    if (this.$route.query.section) {
      // debug removed
      this.scrollToSection(this.$route.query.section);
    } else if (this.$route.params.section) {
      // debug removed
      this.scrollToSection(this.$route.params.section);
    } else if (this.$route.hash) {
      // debug removed
      this.scrollToAnchor(this.$route.hash);
    } else {
      // debug removed
    }
  },
  methods: {
    // 获取分组的ID，处理不同的link格式
    getGroupId(link) {
      if (link.startsWith('#')) {
        return link.substring(1); // 移除 # 号
      } else if (link.startsWith('http')) {
        // 如果是外部链接，生成一个唯一的ID
        return `external-${Date.now()}`;
      } else {
        // 如果是内部路由，使用路径作为ID
        return link.replace(/[^a-zA-Z0-9]/g, '-');
      }
    },

    scrollToSection(section) {
      // debug removed
      this.targetSection = section;

      // 使用 setTimeout 确保DOM完全渲染
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          // debug removed
          this.scrollToElement(element, section);
        } else {
          // debug removed
          // 尝试查找包含该文本的元素
          this.findElementByText(section);
        }
      }, 100);
    },

    scrollToAnchor(hash) {
      if (hash) {
        const decodedHash = decodeURIComponent(hash);
        const section = decodedHash.replace('#', '');
        // debug removed
        nextTick(() => {
          const element = document.getElementById(section);
          if (element) {
            // debug removed
            this.scrollToElement(element, section);
          } else {
            // debug removed
            // 尝试查找包含该文本的元素
            this.findElementByText(section);
          }
        });
      }
    },

    // 优化的滚动到元素方法
    scrollToElement(element, sectionName) {
      // 优先使用原生滚动至顶部，配合 scroll-margin-top 精准对齐
      try {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {
        // 回退方案：计算偏移位置
        const navbarHeight = 80;
        const offset = 30;
        const rect = element.getBoundingClientRect();
        const targetPosition = window.pageYOffset + rect.top - navbarHeight - offset;
        window.scrollTo({ top: Math.max(0, targetPosition), behavior: 'smooth' });
      }

      // 添加高亮效果
      this.highlightElement(element);
      // 更新当前section
      this.currentSection = sectionName;
    },

    // 通过文本内容查找元素
    findElementByText(text) {
      const elements = document.querySelectorAll('h2, h3, .group-container');
      for (const element of elements) {
        if (element.textContent.toLowerCase().includes(text.toLowerCase())) {
          // debug removed
          this.scrollToElement(element, text);
          return;
        }
      }
      // debug removed
    },

    // 高亮元素
    highlightElement(element) {
      // 移除之前的高亮
      document.querySelectorAll('.highlight-anchor').forEach(el => {
        el.classList.remove('highlight-anchor');
      });

      // 添加高亮效果
      element.classList.add('highlight-anchor');

      // 3秒后移除高亮
      setTimeout(() => {
        element.classList.remove('highlight-anchor');
      }, 3000);
    }
  },
}
</script>

<style scoped>
.glass-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06);
}
.dark .glass-card {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.25);
}

.glass-link-card {
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.04);
}
.glass-link-card:hover {
  background: #ffffff;
  border-color: rgba(0, 113, 227, 0.35);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
.dark .glass-link-card {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.06);
}
.dark .glass-link-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(41, 151, 255, 0.4);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.glass-fab {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  color: #0071e3;
}
.glass-fab:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 6px 24px rgba(0, 113, 227, 0.18);
}
.dark .glass-fab {
  background: rgba(28, 28, 30, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
  color: #2997ff;
}

.icon-container {
  background: #f5f5f7;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.dark .icon-container {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.1);
}

.group-container {
  transition: all 0.2s ease;
  scroll-margin-top: 110px;
}

/* 高亮效果 */
.highlight-anchor {
  animation: highlightFade 0.8s ease-in-out;
  border: 2px solid rgba(0, 113, 227, 0.35);
  box-shadow: 0 0 12px rgba(0, 113, 227, 0.22);
}

@keyframes highlightFade {
  0% {
    border-color: rgba(0, 113, 227, 0.6);
    box-shadow: 0 0 16px rgba(0, 113, 227, 0.32);
  }

  100% {
    border-color: rgba(0, 113, 227, 0.35);
    box-shadow: 0 0 12px rgba(0, 113, 227, 0.22);
  }
}

/* 响应式网格 */
@media (max-width: 640px) {
  .card {
    flex-direction: column;
    text-align: center;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 滚动到顶部按钮动画 */
button {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>