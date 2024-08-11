#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import { createServer, build } from 'vite';
import { fileURLToPath } from 'url';
import viteConfigFn from '../vite.config.js';
import { prerender } from '../src/node/prerender.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .version(packageJson.version)
  .description('A CLI tool to generate a static navigation site from a configuration file');

program
  .command('dev')
  .description('Start the development server')
  .option('-c, --config <path>', 'Path to configuration file', 'navpress.config.js')
  .action(async (cmd) => {
    const configPath = path.resolve(process.cwd(), cmd.config);
    process.env.CONFIG_PATH = configPath;
    const viteConfig = await viteConfigFn()
    // 加载 vite 配置
    const server = await createServer({
      ...viteConfig,
      configFile: false,
      server: {
        open: true,
      },
    });

    await server.listen();
    console.log('Development server started.');
  });

program
  .command('build')
  .description('Build the static site')
  .option('-c, --config <path>', 'Path to configuration file', 'navpress.config.js')
  .option('-o, --output <path>', 'Output directory', 'dist')
  .action(async (cmd) => {
    const configPath = path.resolve(process.cwd(), cmd.config);
    const outputDir = path.resolve(process.cwd(), cmd.output );
    process.env.CONFIG_PATH = configPath;
    process.env.OUTPUT_DIR = outputDir;
    const viteConfig = await viteConfigFn()
    // 构建静态站点
    await build({
      ...viteConfig,
      configFile: false,
      build: {
        outDir: outputDir,
      },
    });

    const tempOutputDir = path.resolve(__dirname, '../dist');
    // 预渲染步骤
    await prerender()
    
    // 3. 检查源目录和目标目录是否相同
    if (tempOutputDir !== outputDir) {
      // 4. 将生成的文件从 navpress/dist 复制到第三方项目的 dist 目录
      await fs.copy(tempOutputDir, outputDir);
      console.log(`Files copied from ${tempOutputDir} to ${outputDir}`);

      // 5. 清理 navpress 包中的临时 dist 目录
      await fs.remove(tempOutputDir);
      console.log(`Temporary build directory ${tempOutputDir} removed.`);
    } else {
      console.warn('Source and destination directories are the same. Skipping copy operation.');
    }

    console.log('Build completed.');
  });

program.parse(process.argv);