#!/usr/bin/env node

/**
 * 调试重定向问题的工具
 */

import http from 'http'

const testUrls = [
  'http://localhost:5173/',
  'http://localhost:5173/admin/docs/navpress',
  'http://localhost:5173/admin/docs/navpress/',
  'http://localhost:5173/admin/docs/navpress/#/',
  'http://localhost:5173/admin/docs/navpress/#/usmarthk',
]

async function debugRedirect() {
  console.log('🔍 调试重定向问题')
  console.log('====================\n')

  for (const url of testUrls) {
    console.log(`📍 测试 URL: ${url}`)

    try {
      const response = await makeRequest(url)
      console.log(`   状态码: ${response.statusCode}`)

      if (response.statusCode >= 300 && response.statusCode < 400) {
        console.log(`   重定向到: ${response.headers.location}`)
      }

      if (response.statusCode === 200) {
        const contentType = response.headers['content-type'] || ''
        if (contentType.includes('text/html')) {
          console.log(`   ✅ 返回HTML内容`)
        } else {
          console.log(`   📄 内容类型: ${contentType}`)
        }
      }
    } catch (error) {
      console.log(`   ❌ 错误: ${error.message}`)
    }

    console.log('')
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'HEAD', // 只获取头部信息
      timeout: 5000,
    }

    const req = http.request(url, options, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers,
      })
    })

    req.on('error', reject)
    req.on('timeout', () => reject(new Error('Request timeout')))
    req.setTimeout(5000)
    req.end()
  })
}

debugRedirect()
