import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';
import { renderToString } from '@vue/server-renderer';

export async function prerender() {
  // 创建 Vite 服务器实例
  const server = await createServer({
    server: { middlewareMode: 'ssr' },
    appType: 'custom',
  });

  try {
    // 使用 Vite 服务器加载应用模块
    const { createApp } = await server.ssrLoadModule('/src/main.js');
    const { app, router } = createApp();

    // 跳转到根路径，准备渲染
    router.push('/');
    await router.isReady();

    // 渲染应用到字符串
    const appHtml = await renderToString(app);

    // 读取模板文件
    const templatePath = path.resolve(process.cwd(), 'dist/index.html'); // 目标路径
    const template = fs.readFileSync(templatePath, 'utf-8');

    // 获取打包后的文件名
    const assetsDir = path.resolve(process.cwd(), 'dist/assets');
    const files = fs.readdirSync(assetsDir);
    const cssFile = files.find(file => file.endsWith('.css'));
    const jsFile = files.find(file => file.endsWith('.js'));

    // 替换模板中的占位符
    let html = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`);

    // 替换脚本和样式标签，确保引用正确的文件
    const cssTag = `<link rel="stylesheet" href="/assets/${cssFile}">`;
    const scriptTag = `<script type="module" src="/assets/${jsFile}"></script>`;
    html = html.replace('</head>', `${cssTag}</head>`);
    html = html.replace('<script type="module" src="/src/main.js"></script>', scriptTag);

    // 写入预渲染的 HTML 文件到 dist 目录
    fs.writeFileSync(path.resolve(process.cwd(), 'dist/index.html'), html);

    // 删除多余的 public 目录
    const publicDir = path.resolve(process.cwd(), 'dist/public');
    if (fs.existsSync(publicDir)) {
      fs.rmSync(publicDir, { recursive: true, force: true });
    }
  } catch (e) {
    console.error('Error during prerendering:', e);
  } finally {
    await server.close();
  }
}