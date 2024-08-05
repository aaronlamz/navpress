#!/usr/bin/env node

import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';

const program = new Command();

program
  .version('1.0.0')
  .description('A CLI tool to generate a static navigation site from a configuration file');

program
  .command('dev')
  .description('Start the development server')
  .option('-c, --config <path>', 'Path to configuration file', 'navpress.config.js')
  .action((cmd) => {
    const configPath = path.resolve(process.cwd(), cmd.config || 'navpress.config.js');
    process.env.CONFIG_PATH = configPath;
    execSync('yarn dev', { stdio: 'inherit' });
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
    execSync('yarn build', { stdio: 'inherit' });
  });

program.parse(process.argv);