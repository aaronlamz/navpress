#!/usr/bin/env node

import { Command } from 'commander'
import path from 'path'
import { createServer, build } from 'vite'
import { prerender } from '../src/node/prerender.cjs'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)
const packageJson = require(path.join(__dirname, '../package.json'))

const program = new Command()

const loadViteConfig = async () => {
  const viteConfigPath = path.resolve(__dirname, '../vite.config.js')
  const viteConfigModule = await import(viteConfigPath)
  return viteConfigModule.default()
}

program
  .version(packageJson.version)
  .description(
    'A CLI tool to generate a static navigation site from a configuration file'
  )

program
  .command('dev')
  .description('Start the development server')
  .option(
    '-c, --config <path>',
    'Path to configuration file',
    'navpress.config.js'
  )
  .action(async (cmd) => {
    const configPath = path.resolve(process.cwd(), cmd.config)
    process.env.CONFIG_PATH = configPath
    const viteConfig = await loadViteConfig()

    // 获取 base 路径来决定打开的 URL
    const basePath = viteConfig.base || '/'
    const openUrl = basePath === '/' ? true : basePath

    const server = await createServer({
      ...viteConfig,
      configFile: false,
      base: basePath, // 确保开发服务器使用正确的 base 路径
      server: {
        ...viteConfig.server, // 保留 Vite 配置中的 server 设置
        open: openUrl,
        port: 5173,
        strictPort: false, // 允许使用其他端口
        // 确保开发服务器正确处理 base 路径
        fs: {
          allow: ['..'],
        },
      },
    })

    await server.listen()
    const port = server.config.server.port || 5173
    const serverUrl = `http://localhost:${port}`
    const fullUrl = basePath === '/' ? serverUrl : `${serverUrl}${basePath}`

    console.log(`\n  Development server running at:`)
    console.log(`  Local:   ${fullUrl}`)
    console.log(`  Network: use --host to expose`)
    if (basePath !== '/') {
      console.log(`  Base path: ${basePath}`)
    }
    console.log()
  })

program
  .command('build')
  .description('Build the static site')
  .option(
    '-c, --config <path>',
    'Path to configuration file',
    'navpress.config.js'
  )
  .option('-o, --output <path>', 'Output directory', 'dist')
  .action(async (cmd) => {
    const configPath = path.resolve(process.cwd(), cmd.config)
    const outputDir = cmd.output
      ? path.resolve(process.cwd(), cmd.output)
      : null

    process.env.CONFIG_PATH = configPath

    if (outputDir) {
      process.env.OUTPUT_DIR = outputDir
    }

    const viteConfig = await loadViteConfig()

    try {
      console.log('Starting build process...')
      await build({
        ...viteConfig,
        configFile: false,
      })
      console.log('Build process completed.')
    } catch (error) {
      console.error('Error during build process:', error)
    }

    await prerender()
    console.log('Build completed.')
  })

program.parse(process.argv)
