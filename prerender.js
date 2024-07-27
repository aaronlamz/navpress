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
    server: { middlewareMode: 'ssr' },
    appType: 'custom'
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
    const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')

    // 获取打包后的文件名
    const assetsDir = path.resolve(__dirname, 'dist/assets')
    const files = fs.readdirSync(assetsDir)
    const cssFile = files.find(file => file.endsWith('.css'))
    const jsFile = files.find(file => file.endsWith('.js'))

    // 替换模板中的占位符
    let html = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`)

    // 替换脚本和样式标签，确保引用正确的文件
    const cssTag = `<link rel="stylesheet" href="/assets/${cssFile}">`
    const scriptTag = `<script type="module" src="/assets/${jsFile}"></script>`
    html = html.replace('</head>', `${cssTag}</head>`)
    html = html.replace('<script type="module" src="/src/main.js"></script>', scriptTag)

    // 写入预渲染的 HTML 文件到 dist 目录
    fs.writeFileSync(path.resolve(__dirname, 'dist/index.html'), html)

    // 删除多余的 public 目录
    if (fs.existsSync(path.resolve(__dirname, 'dist/public'))) {
      fs.rmSync(path.resolve(__dirname, 'dist/public'), { recursive: true, force: true })
    }
  } catch (e) {
    console.error(e)
  } finally {
    server.close()
  }
}

prerender()
