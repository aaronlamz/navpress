<template>
  <nav class="glass-nav fixed w-full z-50">
    <div class="container mx-auto flex justify-between items-center py-3 px-6">
      <!-- Logo 和标题 -->
      <div class="flex items-center">
        <img :src="$config.logo" alt="Logo" class="h-10 w-auto mr-3" />
        <span class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ $config.title }}
        </span>
      </div>

      <!-- 移动端菜单按钮 -->
      <button
        @click="$emit('toggle-sidebar')"
        class="md:hidden text-gray-900 dark:text-gray-300 focus:outline-none"
      >
        <i class="fas fa-bars text-2xl"></i>
      </button>

      <!-- 桌面导航和功能按钮 -->
      <div class="hidden md:flex items-center gap-3">
        <!-- 搜索框 -->
        <div class="relative" ref="searchContainer">
          <div class="flex items-center glass-input rounded-xl px-3 py-1.5 transition-all duration-200">
            <i class="fas fa-search text-gray-400 dark:text-gray-500 text-sm mr-2"></i>
            <input
              v-model="searchQuery"
              @focus="showResults = true"
              @input="onSearch"
              @keydown.down.prevent="highlightNext"
              @keydown.up.prevent="highlightPrev"
              @keydown.enter.prevent="selectHighlighted"
              @keydown.escape="closeSearch"
              type="text"
              placeholder="搜索导航..."
              class="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none w-40 lg:w-56"
            />
            <kbd v-if="!searchQuery" class="hidden lg:inline-block text-[10px] text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 ml-1">/</kbd>
            <button v-if="searchQuery" @click="clearSearch" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-1 focus:outline-none">
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
          <!-- 搜索结果下拉 -->
          <div v-if="showResults && searchResults.length > 0"
            class="absolute top-full mt-2 left-0 right-0 glass-dropdown rounded-2xl max-h-80 overflow-y-auto z-50 min-w-[320px]">
            <div
              v-for="(result, idx) in searchResults"
              :key="idx"
              @mousedown.prevent="goToResult(result)"
              @mouseenter="highlightIndex = idx"
              class="flex items-center px-3 py-2.5 cursor-pointer transition-colors"
              :class="highlightIndex === idx ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
            >
              <img :src="result.icon || defaultIcon" alt="" class="w-5 h-5 mr-3 flex-shrink-0 rounded" />
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" v-html="highlight(result.text)"></div>
                <div class="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {{ result.breadcrumb }}
                  <span v-if="result.description"> · {{ result.description }}</span>
                </div>
              </div>
              <span class="text-gray-300 dark:text-gray-600 ml-2 flex-shrink-0">
                <i class="fas fa-arrow-right text-[10px]"></i>
              </span>
            </div>
          </div>
          <!-- 无结果提示 -->
          <div v-if="showResults && searchQuery && searchResults.length === 0"
            class="absolute top-full mt-2 left-0 right-0 glass-dropdown rounded-2xl z-50 min-w-[320px]">
            <div class="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
              <i class="fas fa-search text-lg mb-2 block"></i>
              没有找到匹配的结果
            </div>
          </div>
        </div>
        <!-- GitHub 链接 -->
        <a
          v-if="$config.github"
          :href="$config.github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            class="w-6 h-6 text-gray-900 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6V21.5c-3.3.7-4-1.6-4-1.6-.5-1.4-1.2-1.8-1.2-1.8-.9-.7.1-.7.1-.7 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.3-1.1.5-1.4-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.3 11.3 0 016 0c2.2-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.3.3.6.8.6 1.6v2.4c0 .4.2.7.8.6A12 12 0 0012 0"
            ></path>
          </svg>
        </a>
        <!-- 切换主题按钮 -->
        <button
          @click="toggleDarkMode"
          class="text-gray-900 dark:text-gray-300"
        >
          <span v-if="isDarkMode">🌞</span>
          <span v-else>🌙</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import defaultLinkIcon from '../assets/icons/default-link.svg'

export default {
  props: {
    nav: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isDarkMode: false,
      searchQuery: '',
      searchResults: [],
      showResults: false,
      highlightIndex: -1,
      defaultIcon: defaultLinkIcon,
    }
  },
  mounted() {
    this.isDarkMode =
      localStorage.getItem('darkMode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark')
    }

    // 全局快捷键 / 聚焦搜索框
    document.addEventListener('keydown', this.handleGlobalKey)
    // 点击外部关闭搜索
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleGlobalKey)
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      document.documentElement.classList.toggle('dark', this.isDarkMode)
      localStorage.setItem('darkMode', this.isDarkMode)
    },

    handleGlobalKey(e) {
      // 按 / 聚焦搜索框（不在输入框中时）
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault()
        this.$refs.searchContainer?.querySelector('input')?.focus()
      }
    },

    handleClickOutside(e) {
      if (this.$refs.searchContainer && !this.$refs.searchContainer.contains(e.target)) {
        this.showResults = false
      }
    },

    onSearch() {
      this.highlightIndex = -1
      const q = this.searchQuery.trim().toLowerCase()
      if (!q) {
        this.searchResults = []
        return
      }

      const results = []
      const sidebar = this.$config?.sidebar || []

      for (const category of sidebar) {
        for (const group of (category.items || [])) {
          // 搜索子菜单标题
          if (group.text?.toLowerCase().includes(q)) {
            results.push({
              text: group.text,
              description: '',
              icon: group.icon,
              breadcrumb: category.text,
              parentLink: category.link,
              groupLink: group.link,
              isExternal: false,
            })
          }
          // 搜索具体链接项
          for (const item of (group.items || [])) {
            const matchText = item.text?.toLowerCase().includes(q)
            const matchDesc = item.description?.toLowerCase().includes(q)
            if (matchText || matchDesc) {
              results.push({
                text: item.text,
                description: item.description || '',
                icon: item.icon,
                breadcrumb: `${category.text} / ${group.text}`,
                link: item.link,
                parentLink: category.link,
                groupLink: group.link,
                isExternal: item.link?.startsWith('http'),
              })
            }
          }
        }
      }

      this.searchResults = results.slice(0, 20) // 最多 20 条
      this.showResults = true
    },

    goToResult(result) {
      this.showResults = false
      this.searchQuery = ''
      this.searchResults = []

      // 始终定位到对应的分组区域（而非直接打开外部链接）
      if (result.groupLink?.startsWith('#')) {
        const section = result.groupLink.substring(1)
        const urlFormat = this.$config?.urlFormat || 'query'
        const targetPath = result.parentLink || '/'

        if (urlFormat === 'query') {
          this.$router.push({ path: targetPath, query: { section } })
        } else if (urlFormat === 'path') {
          this.$router.push(`${targetPath}/${section}`)
        } else {
          this.$router.push({ path: targetPath, hash: `#${section}` })
        }
      } else if (result.parentLink) {
        this.$router.push(result.parentLink)
      }
    },

    highlight(text) {
      if (!this.searchQuery.trim()) return text
      const q = this.searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = new RegExp(`(${q})`, 'ig')
      return text.replace(re, '<mark class="bg-yellow-200 dark:bg-yellow-700/50 rounded px-0.5">$1</mark>')
    },

    highlightNext() {
      if (this.highlightIndex < this.searchResults.length - 1) {
        this.highlightIndex++
      }
    },

    highlightPrev() {
      if (this.highlightIndex > 0) {
        this.highlightIndex--
      }
    },

    selectHighlighted() {
      if (this.highlightIndex >= 0 && this.highlightIndex < this.searchResults.length) {
        this.goToResult(this.searchResults[this.highlightIndex])
      }
    },

    closeSearch() {
      this.showResults = false
      this.searchQuery = ''
      this.$refs.searchContainer?.querySelector('input')?.blur()
    },

    clearSearch() {
      this.searchQuery = ''
      this.searchResults = []
      this.showResults = false
    },
  },
}
</script>

<style scoped>
.glass-nav {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.06);
}
.dark .glass-nav {
  background: rgba(17, 24, 39, 0.75);
  border-bottom-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.25);
}

.glass-input {
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.glass-input:focus-within {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.dark .glass-input {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
}
.dark .glass-input:focus-within {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(96, 165, 250, 0.4);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.glass-dropdown {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
}
.dark .glass-dropdown {
  background: rgba(30, 41, 59, 0.88);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
</style>