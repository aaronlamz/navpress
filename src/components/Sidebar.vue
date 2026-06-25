<template>
  <div>
    <!-- 侧边栏 -->
    <transition name="slide">
      <aside v-if="isSidebarOpen || isDesktop"
        class="w-64 sm:w-64 p-4 fixed sm:relative z-40 transition-transform transform glass-sidebar will-change-transform"
        :class="{
          '-translate-x-full': !isSidebarOpen && !isDesktop,
          'translate-x-0': isSidebarOpen || isDesktop,
        }">
        <!-- 一键展开/收起 -->
        <div class="flex items-center justify-end mb-2">
          <button type="button"
            class="text-xs px-2.5 py-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-white/10 transition-colors focus:outline-none flex items-center gap-1"
            @click="toggleAll">
            <i :class="allExpanded ? 'fas fa-compress-alt' : 'fas fa-expand-alt'" class="text-[10px]"></i>
            <span>{{ allExpanded ? '收起全部' : '展开全部' }}</span>
          </button>
        </div>

        <ul class="space-y-2">
          <li v-for="(item, index) in sidebar" :key="item.link">
            <div
              class="flex items-center justify-between rounded-2xl px-3 py-2.5 glass-menu-item transition-all duration-200"
              :class="{ 'menu-item-active': item.link === activePath }">
              <button type="button" class="flex items-center flex-1 min-w-0 text-left focus:outline-none"
                @click.stop="goToTopLevel(item.link)">
                <img :src="item.icon || defaultFolderIcon" alt=""
                  class="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                <span v-tooltip="item.text"
                  class="block font-medium py-1 flex-1 truncate"
                  :class="item.link === activePath ? 'text-blue-600 dark:text-blue-300' : 'text-gray-800 dark:text-gray-100'">{{ item.text }}</span>
              </button>
              <button type="button"
                class="ml-2 px-2 py-1 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 focus:outline-none transition-colors"
                @click.stop="toggleMenu(index)" aria-label="Toggle submenu">
                <i :class="expandedMenu[index] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-xs"></i>
              </button>
            </div>
            <transition name="accordion" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave"
              @after-leave="onAfterLeave">
              <ul v-show="expandedMenu[index]" class="ml-4 mt-2 space-y-1.5 submenu-list smooth">
                <li v-for="group in item.items" :key="group.link">
                  <a @click="handleGroupClick(item.link, group.link)"
                    class="submenu-item block px-3 py-2 rounded-xl flex items-center cursor-pointer glass-submenu-item transition-all duration-200"
                    :class="item.link === activePath && group.link === '#' + activeSection
                      ? 'submenu-item-active'
                      : 'text-gray-600 dark:text-gray-300'">
                    <img :src="group.icon || defaultSubmenuIcon" alt=""
                      class="w-4 h-4 mr-2.5 flex-shrink-0" />
                    <span v-tooltip="group.text" class="truncate">{{ group.text }}</span>
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
import { reactive, ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { generateNavUrl, getCurrentSection } from "../utils/urlHelper.js";
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
    sidebarExpand: {
      type: String,
      default: 'all',
      // active: URL 权威 + 单开 —— 仅展开当前路由对应模块，无匹配则展开第一个
      validator: (v) => ['all', 'first', 'none', 'active'].includes(v),
    },
  },
  data() {
    return {
      defaultFolderIcon,
      defaultSubmenuIcon,
    };
  },
  setup(props) {
    const route = useRoute();
    const expandedMenu = reactive({});
    const isDesktop = ref(false);
    const STORAGE_KEY = "navpress:sidebar:expanded";

    const updateIsDesktop = () => {
      if (typeof window !== "undefined") {
        isDesktop.value = window.innerWidth >= 640;
      }
    };

    // 应用配置里的默认展开策略
    const applyDefaultExpand = () => {
      props.sidebar.forEach((item, index) => {
        if (item.expanded !== undefined) {
          expandedMenu[index] = item.expanded;
          return;
        }
        if (props.sidebarExpand === 'none') {
          expandedMenu[index] = false;
        } else if (props.sidebarExpand === 'first') {
          expandedMenu[index] = index === 0;
        } else {
          expandedMenu[index] = true;
        }
      });
    };

    // 本地缓存：按顶级 link 记忆展开状态（对菜单顺序变化稳健）
    const saveExpanded = () => {
      if (typeof localStorage === "undefined") return;
      try {
        const map = {};
        props.sidebar.forEach((item, i) => {
          if (item.link) map[item.link] = !!expandedMenu[i];
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      } catch (e) { /* ignore */ }
    };
    const restoreExpanded = () => {
      if (typeof localStorage === "undefined") return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const map = JSON.parse(raw);
        props.sidebar.forEach((item, i) => {
          if (item.link && map[item.link] !== undefined) {
            expandedMenu[i] = map[item.link];
          }
        });
      } catch (e) { /* ignore */ }
    };

    // 进入某个模块时，自动展开该模块的菜单
    const expandActiveModule = () => {
      props.sidebar.forEach((item, index) => {
        if (item.link && item.link === route.path) {
          expandedMenu[index] = true;
        }
      });
    };

    // 找到当前路由对应的顶级模块下标（兼容 query 与 path 两种 urlFormat）
    const findActiveIndex = () => {
      let idx = props.sidebar.findIndex(
        (item) => item.link && item.link === route.path
      );
      if (idx === -1) {
        // path 格式：/learn/group1 归属 /learn
        idx = props.sidebar.findIndex(
          (item) =>
            item.link && item.link !== "/" && route.path.startsWith(item.link + "/")
        );
      }
      return idx;
    };

    // active 模式：URL 权威 + 单开 —— 只展开当前模块，无匹配则展开第一个，其余收起
    const applyActiveOnly = () => {
      const active = findActiveIndex();
      const target = active === -1 ? 0 : active;
      props.sidebar.forEach((_, i) => {
        expandedMenu[i] = i === target;
      });
    };

    // 把当前选中的菜单/模块滚动到侧边栏可视区
    const scrollActiveIntoView = () => {
      if (typeof document === "undefined") return;
      setTimeout(() => {
        const el =
          document.querySelector(".submenu-item-active") ||
          document.querySelector(".menu-item-active");
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
      }, 260); // 等手风琴展开动画(200ms)结束
    };

    onMounted(() => {
      if (props.sidebarExpand === 'active') {
        // URL 权威 + 单开：不使用本地缓存，完全由当前路由决定
        applyActiveOnly();
      } else {
        applyDefaultExpand();
        restoreExpanded();      // 覆盖默认：用本地缓存
        expandActiveModule();   // 当前所在模块始终展开
      }
      scrollActiveIntoView();

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

    // 路由变化（切模块 / 切 section）：展开当前模块、缓存、滚动到选中项
    watch(() => route.fullPath, () => {
      if (props.sidebarExpand === 'active') {
        // 单开模式：导航时以 URL 为准，重置为仅当前模块
        applyActiveOnly();
      } else {
        expandActiveModule();
        saveExpanded();
      }
      scrollActiveIntoView();
    });

    const allExpanded = computed(() => {
      return props.sidebar.every((_, index) => expandedMenu[index]);
    });

    // 当前所在模块路径 & section，用于高亮
    const activePath = computed(() => route.path);
    const activeSection = computed(() => getCurrentSection(route, props.urlFormat));

    return { expandedMenu, isDesktop, allExpanded, activePath, activeSection, saveExpanded, scrollActiveIntoView };
  },
  methods: {
    toggleAll() {
      const shouldExpand = !this.allExpanded;
      this.sidebar.forEach((_, index) => {
        this.expandedMenu[index] = shouldExpand;
      });
      this.saveExpanded();
    },
    toggleMenu(index) {
      this.expandedMenu[index] = !this.expandedMenu[index];
      this.saveExpanded();
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
.glass-sidebar {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}
.dark .glass-sidebar {
  background: rgba(15, 23, 42, 0.72);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
}

.glass-menu-item {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
.glass-menu-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.dark .glass-menu-item {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: none;
}
.dark .glass-menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 当前所在模块：高亮 + 左侧强调条 */
.menu-item-active {
  position: relative;
  background: rgba(0, 113, 227, 0.1);
  border-color: rgba(0, 113, 227, 0.28);
  box-shadow: 0 2px 10px rgba(0, 113, 227, 0.1);
}
.menu-item-active::before {
  content: "";
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  border-radius: 9999px;
  background: #0071e3;
}
.dark .menu-item-active {
  background: rgba(41, 151, 255, 0.16);
  border-color: rgba(41, 151, 255, 0.3);
  box-shadow: none;
}
.dark .menu-item-active::before {
  background: #2997ff;
}

/* 当前所在 section：高亮子项 */
.submenu-item-active {
  background: rgba(0, 113, 227, 0.1);
  border-color: rgba(0, 113, 227, 0.22) !important;
  color: #0071e3;
  font-weight: 600;
}
.dark .submenu-item-active {
  background: rgba(41, 151, 255, 0.16);
  color: #2997ff;
}

.glass-submenu-item {
  background: transparent;
  border: 1px solid transparent;
}
.glass-submenu-item:hover {
  background: #f5f5f7;
  border-color: rgba(0, 0, 0, 0.06);
}
.dark .glass-submenu-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
}

.submenu-item {
  transition: all 0.2s ease;
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
    /* 父级 .sidebar-container 因 transform 成为定位包含块，
       这里铺满它即可（它已位于 navbar 之下且高度正确） */
    width: 100%;
    top: 0;
    left: 0;
    height: 100%;
    max-height: 100%;
    /* 菜单项过多时自身可滚动，避免无法选中底部项 */
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    /* 滚到边界时不把滚动“穿透”给下层内容区 */
    overscroll-behavior: contain;
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