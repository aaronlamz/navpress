#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { createServer, build } from 'vite';
import { fileURLToPath } from 'url';
import viteConfigFn from '../vite.config.js';
import {prerender} from '../src/node/prerender.js'

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

    // 预渲染步骤
    await prerender()

    console.log('Build completed.');
  });

program.parse(process.argv);