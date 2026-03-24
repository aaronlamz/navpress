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
    // 传递工作目录，便于 vite.config.js 中正确解析用户配置
    process.env.WORKING_DIR = process.cwd()
    const viteConfig = await loadViteConfig()

    // 获取 base 路径来决定打开的 URL
    const basePath = viteConfig.base || '/'
    const openUrl = basePath === '/' ? true : basePath

    const server = await createServer({
      ...viteConfig,
      configFile: false,
      server: {
        // 保留 viteConfig 中的 watch 和 fs 配置（热重载依赖）
        ...viteConfig.server,
        open: openUrl,
        port: 5173,
        strictPort: false,
        // 确保可以访问用户项目目录中的文件（如配置文件、静态资源）
        fs: {
          ...(viteConfig.server?.fs || {}),
          allow: [
            ...(viteConfig.server?.fs?.allow || []),
            process.cwd(),
          ],
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
    process.env.WORKING_DIR = process.cwd()

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
