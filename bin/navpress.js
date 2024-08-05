#!/usr/bin/env node

import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
  .action((cmd) => {
    const configPath = path.resolve(process.cwd(), cmd.config || 'navpress.config.js');
    process.env.CONFIG_PATH = configPath;

    // 使用 npx 执行 Vite 的开发服务器启动命令
    execSync('npx vite', { stdio: 'inherit' });
  });

program
  .command('build')
  .description('Build the static site')
  .option('-c, --config <path>', 'Path to configuration file', 'navpress.config.js')
  .option('-o, --output <path>', 'Output directory', 'dist')
  .action((cmd) => {
    const configPath = path.resolve(process.cwd(), cmd.config || 'navpress.config.js');
    const outputDir = path.resolve(process.cwd(), cmd.output || 'dist');
    process.env.CONFIG_PATH = configPath;
    process.env.OUTPUT_DIR = outputDir;

    // 使用 npx 执行 Vite 的构建命令
    execSync('npx vite build', { stdio: 'inherit' });
    execSync('node prerender.js', { stdio: 'inherit' });
  });

program.parse(process.argv);