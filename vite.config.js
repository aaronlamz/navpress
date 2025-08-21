import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const loadUserConfig = async () => {
  const configPath =
    process.env.CONFIG_PATH || path.resolve(process.cwd(), 'navpress.config.js')
  let userConfig = {}

  try {
    await fs.access(configPath)
    userConfig = await import(
      configPath + `?timestamp=${new Date().getTime()}`
    ).then((module) => module.default)
  } catch (error) {
    console.error(`Failed to load config from ${configPath}`, error)
  }

  return userConfig
}

export default defineConfig(async () => {
  const outputDir = process.env.OUTPUT_DIR || path.resolve(__dirname, 'dist')
  let userConfig = await loadUserConfig()
  const indexHtmlPath = path.resolve(__dirname, 'index.html')
  const basePath = userConfig.base || '/'

  return {
    base: basePath,

    optimizeDeps: {
      include: ['vue', 'vue-router'],
    },
    plugins: [
      vue(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          // 动态替换 title 和 meta 标签内容
          return html
            .replace(
              /<title>.*<\/title>/,
              `<title>${userConfig.meta?.title || userConfig.title}</title>`
            )
            .replace(
              /<meta name="description" content=".*">/,
              `<meta name="description" content="${userConfig.meta?.description || ''}">`
            )
            .replace(
              /<meta name="keywords" content=".*">/,
              `<meta name="keywords" content="${userConfig.meta?.keywords || ''}">`
            )
            .replace(
              /<meta name="author" content=".*">/,
              `<meta name="author" content="${userConfig.meta?.author || ''}">`
            )
        },
      },
      {
        name: 'watch-external',
        configureServer(server) {
          const configPath =
            process.env.CONFIG_PATH ||
            path.resolve(process.cwd(), 'navpress.config.js')

          // 提供一个开发端点，返回当前最新配置，便于刷新后也能获取到最新配置
          server.middlewares.use('/__navpress_config', async (req, res) => {
            try {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(userConfig || {}))
            } catch (e) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'failed to read config' }))
            }
          })

          // 监听配置文件变化
          server.watcher.add(configPath)

          server.watcher.on('change', async (file) => {
            if (file === configPath) {
              try {
                console.log(`Config file changed: ${configPath}. Reloading...`)

                // 重新加载配置文件
                userConfig = await loadUserConfig()

                // 发送热更新事件到客户端（只做增量更新，不触发整页刷新）
                server.ws.send({
                  type: 'custom',
                  event: 'config-updated',
                  data: userConfig,
                })

                console.log('Config updated successfully:', userConfig)
              } catch (error) {
                console.error('Failed to reload config:', error)
              }
            }
          })
        },
      },
    ],
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            config: path.resolve(__dirname, 'tailwind.config.js'),
          }),
          autoprefixer,
        ],
      },
    },
    define: {
      __USER_CONFIG__: JSON.stringify(userConfig),
    },
    root: path.resolve(__dirname),
    build: {
      outDir: outputDir,
      rollupOptions: {
        input: {
          main: indexHtmlPath,
        },
      },
    },
    server: {
      open: true,
      watch: {
        usePolling: true,
        interval: 300,
      },
    },
  }
})
