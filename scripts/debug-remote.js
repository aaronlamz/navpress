#!/usr/bin/env node

/**
 * 远程调试工具 - 直接在其他项目中运行本地 navpress
 * 用法: node /path/to/navpress/scripts/debug-remote.js [命令] [配置文件路径]
 */

import { createServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// NavPress 项目根目录
const navpressRoot = path.resolve(__dirname, '..')

async function debugRemote() {
  const command = process.argv[2] || 'dev'
  const configPath =
    process.argv[3] || path.join(process.cwd(), 'navpress.config.js')

  console.log('🚀 NavPress 远程调试工具')
  console.log(`📁 NavPress 路径: ${navpressRoot}`)
  console.log(`📄 配置文件: ${configPath}`)
  console.log(`⚡ 命令: ${command}`)

  // 检查配置文件是否存在
  if (!fs.existsSync(configPath)) {
    console.error(`❌ 配置文件不存在: ${configPath}`)
    process.exit(1)
  }

  // 设置环境变量
  process.env.CONFIG_PATH = configPath

  if (command === 'dev') {
    try {
      // 动态加载 vite.config.js
      const viteConfigPath = path.resolve(navpressRoot, 'vite.config.js')
      const viteConfigModule = await import(viteConfigPath)
      const viteConfig = viteConfigModule.default()

      const basePath = viteConfig.base || '/'
      const openUrl = basePath === '/' ? true : basePath

      const server = await createServer({
        ...viteConfig,
        configFile: false,
        root: navpressRoot, // 重要：设置 root 为 navpress 项目目录
        server: {
          open: openUrl,
          port: 5173,
          strictPort: false,
        },
      })

      await server.listen()
      const port = server.config.server.port || 5173
      const serverUrl = `http://localhost:${port}`
      const fullUrl = basePath === '/' ? serverUrl : `${serverUrl}${basePath}`

      console.log(`\n✅ 远程调试服务器启动成功!`)
      console.log(`🔗 本地访问:   ${fullUrl}`)
      console.log(`📄 Base path:  ${basePath}`)
      if (basePath !== '/') {
        console.log(`🔗 根路径:     ${serverUrl} (会自动重定向)`)
      }
      console.log(`📁 工作目录:   ${process.cwd()}`)
      console.log(`📄 配置文件:   ${configPath}`)
      console.log()
      console.log(`💡 这个服务器使用的是本地 NavPress 代码`)
      console.log(`🔄 修改 NavPress 代码会立即生效`)
      console.log(`\n按 Ctrl+C 停止服务器`)
    } catch (error) {
      console.error('❌ 启动开发服务器失败:', error)
      process.exit(1)
    }
  } else {
    console.error(`❌ 不支持的命令: ${command}`)
    console.log('支持的命令: dev')
    process.exit(1)
  }
}

debugRemote()
