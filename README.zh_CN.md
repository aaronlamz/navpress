# NavPress

[![npm 版本](https://img.shields.io/npm/v/navpress.svg)](https://www.npmjs.com/package/navpress)
[![部署到 GitHub Pages](https://github.com/aaronlamz/navpress/actions/workflows/deploy.yml/badge.svg)](https://github.com/aaronlamz/navpress/actions/workflows/deploy.yml)

**NavPress** 是一个用于生成静态导航网站的 CLI 工具。通过配置文件，你可以快速构建一个导航站点，支持开发模式和生产模式。

## 功能特点

- 简单配置：通过一个配置文件定义导航和侧边栏。
- 支持开发和生产构建。
- 内置 SSR 支持，自动生成静态 HTML 文件。
- 集成了 Tailwind CSS 和 Vue.js。

## 预览
[查看演示](https://aaronlamz.github.io/navpress/)

## 安装

你可以通过 npm 全局安装 `navpress`：

```bash
npm install -g navpress@1.0.0-beta.6
```

或者在你的项目中本地安装：

```bash
npm install navpress@1.0.0-beta.6 --save-dev
```

## 快速开始

### 1. 创建配置文件

在项目的根目录下创建一个 `navpress.config.js` 文件，并定义你的导航和侧边栏：

```javascript
export default {
  title: '我的静态网站生成器',
  description: '一个简单的静态网站生成器，具有可配置的导航',
  logo: '/navpress/images/logo.svg',
  github: 'https://github.com/aaronlamz/navpress',
  base: '/navpress/',
  meta: {
    title: '我的自定义标题',
    description: '这是用于 SEO 的描述。',
    keywords: '静态网站, 生成器, SEO',
    author: '作者名称',
  },
  sidebar: [
    { 
      text: '首页', 
      link: '/', 
      items: [
        {
          text: '组 1',
          link: '#group1',
          items: [
            { text: '子项 1', link: 'https://example.com/child1' },
            { text: '子项 2', link: 'https://example.com/child2' },
          ]
        },
        {
          text: '组 2',
          link: '#group2',
          items: [
            { text: '子项 3', link: 'https://example.com/child3' },
            { text: '子项 4', link: 'https://example.com/child4' },
          ]
        },
        {
          text: '组 3',
          link: '#group3',
          items: [
            { text: '子项 3', link: 'https://example.com/child3' },
            { text: '子项 4', link: 'https://example.com/child4' },
          ]
        },
        {
          text: '组 4',
          link: '#group4',
          items: [
            { text: '子项 3', link: 'https://example.com/child3' },
            { text: '子项 4', link: 'https://example.com/child4' },
          ]
        }
      ]
    },
    { 
      text: '关于', 
      link: '/about',
      expanded: false,
      items: [
        {
          text: '组 A',
          link: '#groupA',
          items: [
            { text: '子项 A1', link: 'https://example.com/childA1' },
          ]
        }
      ]
    },
  ],
}
```

### 2. 启动开发服务器

使用以下命令启动开发服务器：

```bash
navpress dev
```

开发服务器会自动在浏览器中打开并显示导航页面。

### 3. 构建静态网站

使用以下命令构建静态网站：

```bash
navpress build
```

构建后的静态文件将输出到 `dist` 目录。你可以将 `dist` 目录部署到任何静态网页托管服务。

## 配置选项

### navpress.config.js

- `title`：网站标题。
- `description`：网站描述。
- `sidebar`：侧边栏的配置，一个可以嵌套多个组的数组。

## 贡献

我们欢迎任何形式的贡献！如果你发现了 Bug 或者有新的想法，请提交一个 [Issue](https://github.com/aaronlamz/navpress/issues) 或者发起一个 [Pull Request](https://github.com/aaronlamz/navpress/pulls)。

## 许可证

[MIT](https://github.com/aaronlamz/navpress/blob/main/LICENSE)