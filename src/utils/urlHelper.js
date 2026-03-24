/**
 * URL 辅助工具函数
 * 支持多种URL格式，解决聊天工具中URL参数丢失的问题
 */

/**
 * 生成导航链接URL
 * @param {string} basePath - 基础路径
 * @param {string} section - 区域标识
 * @param {string} format - URL格式 ('query' | 'hash' | 'path')
 * @returns {string} 生成的URL
 */
export function generateNavUrl(basePath, section, format = 'query') {
  switch (format) {
    case 'query':
      // 使用查询参数: /path?section=group1
      return `${basePath}?section=${encodeURIComponent(section)}`

    case 'path':
      // 使用路径参数: /path/group1
      return `${basePath}/${encodeURIComponent(section)}`

    case 'hash':
    default:
      // 使用锚点: /path#group1
      return `${basePath}#${section}`
  }
}

/**
 * 解析URL中的区域信息
 * @param {string} url - 要解析的URL
 * @param {string} format - URL格式
 * @returns {string|null} 区域标识，如果没有则返回null
 */
export function parseSectionFromUrl(url, format = 'query') {
  try {
    const urlObj = new URL(url)

    switch (format) {
      case 'query':
        return urlObj.searchParams.get('section')

      case 'path': {
        const pathParts = urlObj.pathname.split('/')
        return pathParts[pathParts.length - 1] || null
      }

      case 'hash':
        return urlObj.hash.substring(1) || null

      default:
        return null
    }
  } catch (error) {
    // console.error('URL解析错误:', error)
    return null
  }
}

/**
 * 获取当前页面的区域标识
 * @param {Object} route - Vue Router的route对象
 * @param {string} format - URL格式
 * @returns {string|null} 区域标识
 */
export function getCurrentSection(route, format = 'query') {
  switch (format) {
    case 'query':
      return route.query.section

    case 'path': {
      const pathParts = route.path.split('/')
      return pathParts[pathParts.length - 1] || null
    }

    case 'hash':
      return route.hash.substring(1) || null

    default:
      return null
  }
}

/**
 * 生成分享链接
 * @param {string} baseUrl - 基础URL
 * @param {string} path - 路径
 * @param {string} section - 区域标识
 * @param {string} format - URL格式
 * @returns {string} 分享链接
 */
export function generateShareUrl(baseUrl, path, section, format = 'query') {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '') // 移除末尾的斜杠
  const cleanPath = path.replace(/^\//, '') // 移除开头的斜杠

  switch (format) {
    case 'query':
      return `${cleanBaseUrl}/${cleanPath}?section=${encodeURIComponent(section)}`

    case 'path':
      return `${cleanBaseUrl}/${cleanPath}/${encodeURIComponent(section)}`

    case 'hash':
    default:
      return `${cleanBaseUrl}/${cleanPath}#${section}`
  }
}
