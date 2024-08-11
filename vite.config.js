import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadUserConfig = async () => {
  const configPath = process.env.CONFIG_PATH || path.resolve(process.cwd(), 'navpress.config.js');
  let userConfig = {};

  try {
    await fs.access(configPath);
    userConfig = await import(configPath).then(module => module.default);
  } catch (error) {
    console.error(`Failed to load config from ${configPath}`, error);
  }

  return userConfig;
};

export default defineConfig(async () => {
  const outputDir = process.env.OUTPUT_DIR || path.resolve(__dirname, 'dist');    // 开发模式下输出到 navpress 包的 dist 目录
  const userConfig = await loadUserConfig();
  
 

  // 修改为使用 navpress 包内的 index.html
  const indexHtmlPath = path.resolve(__dirname, 'index.html')

  return {
    plugins: [vue()],
    define: {
      __USER_CONFIG__: JSON.stringify(userConfig),
    },
    root: path.resolve(__dirname, ''),  // 开发模式下使用 navpress 包的目录
    build: {
      outDir: outputDir,
      rollupOptions: {
        input: indexHtmlPath,  // 指向 `navpress` 源代码中的 `index.html`
      },
    },
    server: {
      open: true,  // 自动在浏览器中打开
    },
  };
});