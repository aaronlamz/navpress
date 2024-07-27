import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'vite'
import { renderToString } from '@vue/server-renderer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function prerender() {
  // 创建 Vite 服务器实例
  const server = await createServer({
    server: { middlewareMode: true },
  })

  try {
    // 使用 Vite 服务器加载应用模块
    const { createApp } = await server.ssrLoadModule('/src/main.js')
    const { app, router } = createApp()

    // 跳转到根路径
    router.push('/')
    await router.isReady()

    // 渲染应用到字符串
    const appHtml = await renderToString(app)

    // 读取模板文件
    const template = fs.readFileSync(path.resolve(__dirname, 'public/index.html'), 'utf-8')
    // 替换模板中的占位符
    const html = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`)

    // 写入预渲染的 HTML 文件
    fs.writeFileSync(path.resolve(__dirname, 'dist/index.html'), html)
  } catch (e) {
    console.error(e)
  } finally {
    server.close()
  }
}

prerender()
