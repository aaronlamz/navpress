#!/usr/bin/env node

import { createServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 加载本地 vite 配置
const loadViteConfig = async () => {
  const viteConfigPath = path.resolve(__dirname, '../vite.config.js')
  const viteConfigModule = await import(viteConfigPath)
  return viteConfigModule.default()
}

async function testLocal() {
  console.log('🔍 Testing local NavPress configuration...')

  // 设置测试配置文件路径
  const testConfigPath =
    process.argv[2] ||
    '/Users/jiajunlin/usmart-code/pintree-nav/navpress.config.js'
  process.env.CONFIG_PATH = testConfigPath

  console.log(`📁 Using config: ${testConfigPath}`)

  try {
    const viteConfig = await loadViteConfig()
    console.log(`🌐 Base path: ${viteConfig.base}`)

    const server = await createServer({
      ...viteConfig,
      configFile: false,
      server: {
        open: false, // 不自动打开浏览器
        port: 5173,
        strictPort: false,
      },
    })

    await server.listen()
    const port = server.config.server.port || 5173
    const basePath = viteConfig.base || '/'
    const serverUrl = `http://localhost:${port}`
    const fullUrl = basePath === '/' ? serverUrl : `${serverUrl}${basePath}`

    console.log(`\n✅ Test server started successfully!`)
    console.log(`🔗 Root URL: ${serverUrl}`)
    console.log(`🔗 Full URL: ${fullUrl}`)
    console.log(`📄 Base path: ${basePath}`)

    console.log(`\n🧪 Test these URLs in your browser:`)
    console.log(`   1. ${serverUrl} (should redirect to base path)`)
    console.log(`   2. ${fullUrl} (should show the app)`)

    console.log(`\n💡 Press Ctrl+C to stop the test server`)

    // 监听退出信号
    process.on('SIGINT', () => {
      console.log('\n👋 Stopping test server...')
      server.close()
      process.exit(0)
    })
  } catch (error) {
    console.error('❌ Failed to start test server:', error)
    process.exit(1)
  }
}

testLocal()
