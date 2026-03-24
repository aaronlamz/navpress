<template>
  <div class="config-status fixed top-20 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-w-sm">
    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
      配置状态
    </h3>
    
    <div class="space-y-2 text-xs">
      <div class="flex justify-between">
        <span class="text-gray-600 dark:text-gray-400">标题:</span>
        <span class="text-gray-800 dark:text-gray-200">{{ config?.title || 'N/A' }}</span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-600 dark:text-gray-400">URL格式:</span>
        <span class="text-gray-800 dark:text-gray-200">{{ config?.urlFormat || 'hash' }}</span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-600 dark:text-gray-400">侧边栏项目:</span>
        <span class="text-gray-800 dark:text-gray-200">{{ config?.sidebar?.length || 0 }}</span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-600 dark:text-gray-400">最后更新:</span>
        <span class="text-gray-800 dark:text-gray-200">{{ lastUpdateTime }}</span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-600 dark:text-gray-400">状态:</span>
        <span 
          :class="{
            'text-green-600': isConfigValid,
            'text-red-600': !isConfigValid,
            'text-yellow-600': isUpdating
          }"
          class="font-medium"
        >
          {{ configStatus }}
        </span>
      </div>
    </div>
    
    <div class="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
      <button 
        @click="testConfigUpdate"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded transition-colors mb-2"
        :disabled="isUpdating"
      >
        {{ isUpdating ? '更新中...' : '测试配置更新' }}
      </button>
      
      <button 
        @click="testUrlFormat"
        class="w-full bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2 rounded transition-colors"
        :disabled="isUpdating"
      >
        测试URL格式
      </button>
    </div>
    
    <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
      修改 navpress.config.js 文件即可热更新
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue'

export default {
  name: 'ConfigStatus',
  setup() {
    const lastUpdateTime = ref(new Date().toLocaleTimeString())
    const isUpdating = ref(false)
    const updateCount = ref(0)
    
    // 通过 inject 获取配置
    const config = inject('$config')
    
    const isConfigValid = computed(() => {
      return config && config.title && config.sidebar
    })
    
    const configStatus = computed(() => {
      if (isUpdating.value) return '更新中'
      if (isConfigValid.value) return '正常'
      return '异常'
    })
    
    const testConfigUpdate = () => {
      isUpdating.value = true
      updateCount.value++
      
      // 模拟配置更新
      setTimeout(() => {
        isUpdating.value = false
        lastUpdateTime.value = new Date().toLocaleTimeString()
      }, 1000)
    }
    
    const testUrlFormat = () => {
      isUpdating.value = true
      
      // 测试当前URL格式下的路由跳转
      const currentFormat = config?.urlFormat || 'query'
      console.log('当前URL格式:', currentFormat)
      
      // 模拟点击侧边栏项目
      setTimeout(() => {
        if (currentFormat === 'query') {
          console.log('测试查询参数格式: /?section=frameworks')
        } else if (currentFormat === 'path') {
          console.log('测试路径参数格式: /frameworks')
        } else if (currentFormat === 'hash') {
          console.log('测试锚点格式: /#frameworks')
        }
        
        isUpdating.value = false
        lastUpdateTime.value = new Date().toLocaleTimeString()
      }, 1000)
    }
    
    onMounted(() => {
      // 监听配置更新事件
      if (import.meta.hot) {
        import.meta.hot.on('config-updated', () => {
          updateCount.value++
          lastUpdateTime.value = new Date().toLocaleTimeString()
          console.log('Config updated in ConfigStatus component')
        })
      }
    })
    
    return {
      lastUpdateTime,
      isUpdating,
      updateCount,
      isConfigValid,
      configStatus,
      testConfigUpdate,
      testUrlFormat,
      config
    }
  }
}
</script>

<style scoped>
.config-status {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
}

.dark .config-status {
  background-color: rgba(31, 41, 55, 0.95);
}
</style>
