<template>
  <div>
    <!-- 侧边栏 -->
    <transition name="slide">
      <aside v-if="isSidebarOpen || isDesktop"
        class="w-64 sm:w-64 p-4 fixed sm:relative z-40 transition-transform transform backdrop-blur-md bg-white/60 dark:bg-gray-800/40 border border-white/20 dark:border-white/10 shadow-md rounded-2xl will-change-transform"
        :class="{
          '-translate-x-full': !isSidebarOpen && !isDesktop,
          'translate-x-0': isSidebarOpen || isDesktop,
        }">
        <ul class="space-y-2">
          <li v-for="(item, index) in sidebar" :key="item.link">
            <div
              class="flex items-center justify-between rounded-xl px-3 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-600/20 dark:to-purple-600/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 backdrop-blur-sm border border-blue-200/40 dark:border-blue-400/20 shadow-md">
              <button type="button" class="flex items-center flex-1 text-left focus:outline-none"
                @click.stop="goToTopLevel(item.link)">
                <img :src="item.icon || defaultFolderIcon" alt=""
                  class="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                <span class="block text-gray-800 dark:text-gray-100 font-medium py-1 flex-1">{{ item.text }}</span>
              </button>
              <button type="button"
                class="ml-2 px-2 py-1 rounded-lg hover:bg-white/40 dark:hover:bg-white/20 text-blue-600 dark:text-blue-400 focus:outline-none transition-colors"
                @click.stop="toggleMenu(index)" aria-label="Toggle submenu">
                <i :class="expandedMenu[index] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
              </button>
            </div>
            <transition name="accordion" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave"
              @after-leave="onAfterLeave">
              <ul v-show="expandedMenu[index]" class="ml-4 mt-2 space-y-1.5 submenu-list smooth">
                <li v-for="group in item.items" :key="group.link">
                  <a @click="handleGroupClick(item.link, group.link)"
                    class="submenu-item block text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg flex items-center cursor-pointer bg-white/60 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20 border border-gray-200/50 dark:border-gray-600/30 shadow-sm hover:shadow-md transition-all duration-200">
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mr-3 flex-shrink-0"></div>
                    <img :src="group.icon || defaultSubmenuIcon" alt=""
                      class="w-4 h-4 mr-2.5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    {{ group.text }}
                  </a>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </aside>
    </transition>
  </div>
</template>

<script>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { generateNavUrl } from "../utils/urlHelper.js";
import defaultFolderIcon from "../assets/icons/default-folder.svg";
import defaultSubmenuIcon from "../assets/icons/default-submenu.svg";

export default {
  props: {
    sidebar: {
      type: Array,
      required: true,
    },
    isSidebarOpen: {
      type: Boolean,
      required: true,
    },
    toggleSidebar: {
      type: Function,
      required: true,
    },
    urlFormat: {
      type: String,
      default: 'query',
    },
  },
  data() {
    return {
      defaultFolderIcon,
      defaultSubmenuIcon,
    };
  },
  setup(props) {
    const expandedMenu = reactive({});
    const isDesktop = ref(false);

    const updateIsDesktop = () => {
      if (typeof window !== "undefined") {
        isDesktop.value = window.innerWidth >= 640;
      }
    };

    onMounted(() => {
      props.sidebar.forEach((item, index) => {
        expandedMenu[index] = item.expanded !== undefined ? item.expanded : true;
      });

      updateIsDesktop();
      if (typeof window !== "undefined") {
        window.addEventListener("resize", updateIsDesktop);
      }
    });

    onUnmounted(() => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateIsDesktop);
      }
    });

    return { expandedMenu, isDesktop };
  },
  methods: {
    toggleMenu(index) {
      this.expandedMenu[index] = !this.expandedMenu[index];
    },
    handleGroupClick(parentLink, groupLink) {
      // debug removed

      // 如果是外部链接，直接打开
      if (groupLink.startsWith("http")) {
        window.open(groupLink, "_blank");
        return;
      }

      // 如果是锚点链接，根据配置的格式生成URL
      if (groupLink.startsWith("#")) {
        const section = groupLink.substring(1); // 移除 # 号
        const currentPath = this.$route.path;
        const targetPath = parentLink && typeof parentLink === 'string' ? parentLink : currentPath;
        // debug removed

        if (this.urlFormat === 'query') {
          // 使用查询参数: /target-path?section=group1
          // debug removed
          this.$router.push({
            path: targetPath,
            query: { section: section }
          });
        } else if (this.urlFormat === 'path') {
          // 使用路径参数: /target-path/group1
          // debug removed
          const newPath = `${targetPath}/${section}`;
          this.$router.push(newPath);
        } else {
          // 使用锚点: /target-path#group1
          // debug removed
          this.$router.push({
            path: targetPath,
            hash: `#${section}`
          });
        }
      } else {
        // 普通路由跳转
        // debug removed
        this.$router.push(parentLink);
      }

      // 移动端关闭侧边栏
      if (!this.isDesktop) {
        this.toggleSidebar();
      }
    },
    goToTopLevel(path) {
      if (!path || typeof path !== 'string') return;
      if (this.$route.path === path) return;
      // 切换页面时清理原 section 参数，避免跨页残留滚动
      this.$router.push({ path });
    },
    // 更顺滑的高度过渡
    onEnter(el) {
      el.style.overflow = 'hidden'
      el.style.height = '0px'
      el.style.opacity = '0'
      requestAnimationFrame(() => {
        const target = el.scrollHeight
        el.style.willChange = 'height, opacity'
        el.style.height = target + 'px'
        el.style.opacity = '1'
      })
    },
    onAfterEnter(el) {
      el.style.height = 'auto'
      el.style.overflow = 'visible'
      el.style.willChange = ''
    },
    onLeave(el) {
      el.style.overflow = 'hidden'
      el.style.willChange = 'height, opacity'
      const current = el.scrollHeight
      el.style.height = current + 'px'
      el.style.opacity = '1'
      requestAnimationFrame(() => {
        el.style.height = '0px'
        el.style.opacity = '0'
      })
    },
    onAfterLeave(el) {
      el.style.height = ''
      el.style.opacity = ''
      el.style.overflow = ''
      el.style.willChange = ''
    },
  },
};
</script>

<style scoped>
.submenu-item {
  transition:
    background 0.3s ease,
    transform 0.3s ease,
    border-radius 0.3s ease;
  border-radius: 0.5rem;
}

.submenu-item:hover {
  background-image: linear-gradient(135deg,
      #e0eafc,
      #cfdef3);
}

.accordion-enter-active,
.accordion-leave-active {
  transition: height 200ms cubic-bezier(0.33, 1, 0.68, 1), opacity 140ms ease;
}

.accordion-enter-from,
.accordion-leave-to {
  height: 0;
  opacity: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  height: var(--accordion-content-height);
  opacity: 1;
}

.submenu-list {
  overflow: hidden;
  contain: layout paint;
  will-change: height, opacity;
}

.submenu-list.smooth>* {
  transition: opacity 120ms ease;
}

@media (max-width: 640px) {
  aside {
    width: 100%;
  }
}

/* 移动端隐藏侧边栏 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>