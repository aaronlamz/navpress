#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const { createServer, build } = require('vite');
// const { fileURLToPath } = require('url');
const { prerender } = require('../src/node/prerender.cjs');

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const packageJson = require(path.join(__dirname, '../package.json'));

const program = new Command();

const loadViteConfig = async () => {
  const viteConfigPath = path.resolve(__dirname, '../vite.config.js');
  const viteConfigModule = await import(viteConfigPath);
  return viteConfigModule.default();
};

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
    const viteConfig = await loadViteConfig();

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
    const outputDir = cmd.output ? path.resolve(process.cwd(), cmd.output) : null;

    process.env.CONFIG_PATH = configPath;

    if (outputDir) {
      process.env.OUTPUT_DIR = outputDir;
    }

    const viteConfig = await loadViteConfig();

    try {
      console.log('Starting build process...');
      await build({
        ...viteConfig,
        configFile: false,
      });
      console.log('Build process completed.');
    } catch (error) {
      console.error('Error during build process:', error);
    }

    await prerender();
    console.log('Build completed.');
  });

program.parse(process.argv);