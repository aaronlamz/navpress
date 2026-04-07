#!/usr/bin/env node

import { Command } from 'commander'
import path from 'path'
import fs from 'fs'
import http from 'http'
import crypto from 'crypto'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)
const packageJson = require(path.join(__dirname, '../package.json'))

// navpress 包内预构建的 dist 目录
const DIST_DIR = path.resolve(__dirname, '../dist')

/**
 * 加载用户配置文件（ESM 格式）
 */
async function loadUserConfig(configPath) {
  try {
    const module = await import(configPath + `?t=${Date.now()}`)
    return module.default || {}
  } catch (error) {
    console.error(`Failed to load config from ${configPath}`, error.message)
    return {}
  }
}

/**
 * 读取预构建的 index.html 并注入用户配置
 */
function buildHtml(templateHtml, userConfig, basePath) {
  let html = templateHtml

  // 替换 meta 标签
  html = html
    .replace(/<title>.*?<\/title>/, `<title>${userConfig.meta?.title || userConfig.title || 'NavPress'}</title>`)
    .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${userConfig.meta?.description || ''}">`)
    .replace(/<meta name="keywords" content=".*?">/, `<meta name="keywords" content="${userConfig.meta?.keywords || ''}">`)
    .replace(/<meta name="author" content=".*?">/, `<meta name="author" content="${userConfig.meta?.author || ''}">`)

  // 替换内联配置（匹配 window.__USER_CONFIG__ = {...};）
  html = html.replace(
    /window\.__USER_CONFIG__\s*=\s*\{.*?\};/s,
    `window.__USER_CONFIG__ = ${JSON.stringify(userConfig)};`
  )

  // 修正资源路径中的 base（预构建产物中的 base 可能和用户配置的不同）
  // 匹配 /assets/ 或 /any/path/assets/ 两种形式，统一替换为用户配置的 base
  html = html.replace(/(src|href)="(\/[^"]*?)?\/assets\//g, `$1="${basePath}assets/`)
  html = html.replace(/(src|href)="(\/[^"]*?)?\/images\//g, `$1="${basePath}images/`)

  return html
}

/**
 * MIME 类型映射
 */
function getMimeType(ext) {
  const mimes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
  }
  return mimes[ext] || 'application/octet-stream'
}

const program = new Command()

program
  .version(packageJson.version)
  .description('A CLI tool to generate a static navigation site from a configuration file')

// ===================== dev 命令 =====================
program
  .command('dev')
  .description('Start the development server')
  .option('-c, --config <path>', 'Path to configuration file', 'navpress.config.js')
  .option('-p, --port <port>', 'Dev server port', '5173')
  .action(async (cmd) => {
    const configPath = path.resolve(process.cwd(), cmd.config)
    const port = parseInt(cmd.port, 10)

    let userConfig = await loadUserConfig(configPath)
    const basePath = userConfig.base || '/'

    // 读取预构建模板
    const templateHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8')

    // WebSocket 客户端集合（用于配置热重载推送）
    const wsClients = new Set()

    // 生成 HMR 客户端脚本（注入到 HTML 中）
    const hmrScript = `
<script>
(function() {
  function connect() {
    var ws = new WebSocket('ws://' + location.host + '/__navpress_ws');
    ws.onmessage = function(event) {
      try {
        var data = JSON.parse(event.data);
        if (data.type === 'config-updated') {
          console.log('[navpress] Config updated, reloading...');
          window.location.reload();
        }
      } catch(e) {}
    };
    ws.onclose = function() {
      // 静默重连，不刷新页面
      setTimeout(connect, 2000);
    };
  }
  connect();
})();
</script>`

    // HTTP 服务器
    const server = http.createServer((req, res) => {
      let url = req.url.split('?')[0]

      // 配置 API 端点
      if (url === '/__navpress_config' || url === `${basePath}__navpress_config`) {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(userConfig))
        return
      }

      // 去除 base 前缀
      if (basePath !== '/' && url.startsWith(basePath)) {
        url = '/' + url.slice(basePath.length)
      }

      // 根路径重定向到 base（如果有）
      if (basePath !== '/' && (req.url === '/' || req.url === '')) {
        res.writeHead(302, { Location: basePath })
        res.end()
        return
      }

      // 尝试从 dist 目录提供静态文件
      let filePath = path.join(DIST_DIR, url)

      // 同时检查用户项目的 public 目录（图片等静态资源）
      const userPublicPath = path.join(process.cwd(), 'public', url)

      if (fs.existsSync(userPublicPath) && fs.statSync(userPublicPath).isFile()) {
        filePath = userPublicPath
      }

      // SPA fallback：如果文件不存在或是目录，返回 index.html
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        let html = buildHtml(templateHtml, userConfig, basePath)
        html = html.replace('</body>', `${hmrScript}</body>`)
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(html)
        return
      }

      // 返回静态文件
      const ext = path.extname(filePath).toLowerCase()
      res.setHeader('Content-Type', getMimeType(ext))

      // 特殊处理 index.html — 注入最新配置 + HMR 脚本
      if (filePath.endsWith('index.html')) {
        let html = buildHtml(fs.readFileSync(filePath, 'utf-8'), userConfig, basePath)
        html = html.replace('</body>', `${hmrScript}</body>`)
        res.end(html)
        return
      }

      fs.createReadStream(filePath).pipe(res)
    })

    // WebSocket 升级处理
    server.on('upgrade', (req, socket, _head) => {
      if (req.url !== '/__navpress_ws') {
        socket.destroy()
        return
      }

      // 简易 WebSocket 握手
      const key = req.headers['sec-websocket-key']
      const accept = crypto.createHash('sha1')
        .update(key + '258EAFA5-E914-47DA-95CA-5AB5DC11CE56')
        .digest('base64')

      socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\n' +
        'Connection: Upgrade\r\n' +
        `Sec-WebSocket-Accept: ${accept}\r\n` +
        '\r\n'
      )

      wsClients.add(socket)
      socket.on('close', () => wsClients.delete(socket))
      socket.on('error', () => wsClients.delete(socket))
    })

    // 发送 WebSocket 帧
    function wsSend(socket, data) {
      const payload = Buffer.from(JSON.stringify(data))
      const frame = Buffer.alloc(2 + (payload.length > 125 ? 2 : 0) + payload.length)
      frame[0] = 0x81 // text frame
      let offset = 1
      if (payload.length > 125) {
        frame[offset++] = 126
        frame.writeUInt16BE(payload.length, offset)
        offset += 2
      } else {
        frame[offset++] = payload.length
      }
      payload.copy(frame, offset)
      socket.write(frame)
    }

    // 监听配置文件变化
    let debounceTimer = null
    fs.watch(configPath, () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(async () => {
        console.log(`\n  Config file changed. Reloading...`)
        userConfig = await loadUserConfig(configPath)
        console.log(`  ✅ Config reloaded: ${userConfig.title || 'untitled'}`)

        // 通知所有客户端
        for (const socket of wsClients) {
          try {
            wsSend(socket, { type: 'config-updated' })
          } catch {
            wsClients.delete(socket)
          }
        }
      }, 200)
    })

    // 查找可用端口
    const findPort = (startPort) => new Promise((resolve, reject) => {
      const s = http.createServer()
      s.listen(startPort, () => { s.close(() => resolve(startPort)) })
      s.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`  Port ${startPort} in use, trying ${startPort + 1}...`) // eslint-disable-line no-console
          resolve(findPort(startPort + 1))
        } else {
          reject(err)
        }
      })
    })

    const availablePort = await findPort(port)
    server.listen(availablePort, () => {
      const fullUrl = `http://localhost:${availablePort}${basePath}`
      console.log(`\n  NavPress dev server v${packageJson.version}`) // eslint-disable-line no-console
      console.log(`  Local:   ${fullUrl}`) // eslint-disable-line no-console
      if (basePath !== '/') {
        console.log(`  Base:    ${basePath}`) // eslint-disable-line no-console
      }
      console.log(`  Config:  ${configPath}`) // eslint-disable-line no-console
      console.log() // eslint-disable-line no-console

      // 自动打开浏览器
      const open = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
      import('child_process').then(({ exec }) => exec(`${open} ${fullUrl}`))
    })
  })

// ===================== build 命令 =====================
program
  .command('build')
  .description('Build the static site')
  .option('-c, --config <path>', 'Path to configuration file', 'navpress.config.js')
  .option('-o, --output <path>', 'Output directory', 'dist')
  .action(async (cmd) => {
    const configPath = path.resolve(process.cwd(), cmd.config)
    const outputDir = path.resolve(process.cwd(), cmd.output)

    console.log('Building static site...')
    console.log(`  Config: ${configPath}`)
    console.log(`  Output: ${outputDir}`)

    const userConfig = await loadUserConfig(configPath)
    const basePath = userConfig.base || '/'

    // 1. 清空输出目录后复制预构建的 dist
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true })
    }
    copyDirSync(DIST_DIR, outputDir)

    // 2. 复制用户项目的 public 目录（如果存在）
    const userPublicDir = path.join(process.cwd(), 'public')
    if (fs.existsSync(userPublicDir)) {
      copyDirSync(userPublicDir, outputDir)
    }

    // 3. 注入用户配置到 index.html
    const indexPath = path.join(outputDir, 'index.html')
    let html = fs.readFileSync(indexPath, 'utf-8')
    html = buildHtml(html, userConfig, basePath)

    // 移除开发模式的 ConfigStatus 组件（如果预渲染中包含）
    html = html.replace(/<div class="config-status[\s\S]*?<\/div><\/div><\/div>/g, '')

    fs.writeFileSync(indexPath, html)

    console.log(`\n  ✅ Build completed!`)
    console.log(`  Output: ${outputDir}`)
    console.log(`  Files:`)
    listFiles(outputDir, '    ')
  })

/**
 * 递归复制目录
 */
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

/**
 * 列出目录中的文件
 */
function listFiles(dir, indent = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      console.log(`${indent}${entry.name}/`)
      listFiles(path.join(dir, entry.name), indent + '  ')
    } else {
      const size = fs.statSync(path.join(dir, entry.name)).size
      const sizeStr = size > 1024 ? `${(size / 1024).toFixed(1)} KB` : `${size} B`
      console.log(`${indent}${entry.name} (${sizeStr})`)
    }
  }
}

program.parse(process.argv)
