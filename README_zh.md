# NavPress

[![npm version](https://img.shields.io/npm/v/navpress.svg)](https://www.npmjs.com/package/navpress)
[![Deploy to GitHub Pages](https://github.com/aaronlamz/navpress/actions/workflows/deploy.yml/badge.svg)](https://github.com/aaronlamz/navpress/actions/workflows/deploy.yml)

> 简体中文 | [English](./README.md)

**NavPress** 是一个用于生成静态导航网站的 CLI 工具。通过配置文件即可快速构建导航站点，支持开发和生产模式。

## 特性

- 🎯 **简单配置**：通过单个配置文件定义导航和侧边栏
- ⚡ **开发模式**：支持配置文件热更新，修改即生效
- 🏗️ **生产构建**：内置 SSR 支持，自动生成静态 HTML 文件
- 🎨 **现代技术栈**：基于 Vue.js 和 Tailwind CSS 构建
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🔗 **灵活路由**：支持多种 URL 格式（query、path、hash）
- 🖼️ **内置图标**：提供默认图标，支持自定义

## 预览

[查看演示](https://aaronlamz.github.io/navpress/)

## 安装

### 全局安装

```bash
npm install -g navpress@latest
```

### 项目内安装

```bash
npm install navpress@latest --save-dev
```

## 快速开始

### 1. 创建配置文件

在项目根目录创建 `navpress.config.js`：

```javascript
export default {
  title: '我的导航站',
  description: '个人收藏的优质网站导航',
  logo: '/images/logo.svg',
  base: '/',

  sidebar: [
    {
      text: '开发工具',
      link: '/tools',
      items: [
        {
          text: '前端框架',
          link: '#frameworks',
          items: [
            {
              text: 'Vue.js',
              link: 'https://vuejs.org',
              description: '渐进式 JavaScript 框架',
            },
            {
              text: 'React',
              link: 'https://reactjs.org',
              description: '用于构建用户界面的 JavaScript 库',
            },
          ],
        },
      ],
    },
  ],
}
```

### 2. 启动开发服务器

```bash
# 如果全局安装
navpress dev

# 如果项目内安装
npx navpress dev
```

### 3. 构建生产版本

```bash
# 构建静态文件
navpress build

# 构建后的文件在 dist 目录
```

## 配置说明

### 基础配置

| 字段          | 类型   | 说明                              |
| ------------- | ------ | --------------------------------- |
| `title`       | string | 网站标题                          |
| `description` | string | 网站描述                          |
| `logo`        | string | Logo 图片路径                     |
| `base`        | string | 部署基础路径，默认 '/'            |
| `urlFormat`   | string | URL 格式：'query'、'path'、'hash' |

### 侧边栏配置

```javascript
sidebar: [
  {
    text: '分类名称',
    link: '/category', // 分类页面路径
    icon: '/icon.svg', // 可选：自定义图标
    items: [
      {
        text: '子分组',
        link: '#section', // 锚点链接
        items: [
          {
            text: '网站名称',
            link: 'https://example.com',
            icon: '/site-icon.svg', // 可选
            description: '网站描述', // 可选
          },
        ],
      },
    ],
  },
]
```

### URL 格式说明

- **query** (推荐)：`/tools?section=frameworks` - 使用查询参数
- **path**：`/tools/frameworks` - 使用路径参数
- **hash**：`/tools#frameworks` - 使用 hash 参数

## 部署

### GitHub Pages

1. Fork 此仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 `gh-pages` 分支作为源
4. 修改 `navpress.config.js` 为你的配置

### 其他静态托管

```bash
# 构建
navpress build

# 部署 dist 目录到任何静态托管服务
# 如 Netlify、Vercel、GitHub Pages 等
```

## 开发

### 热更新

开发模式下支持配置文件热更新：

- 修改 `navpress.config.js` 自动生效
- 无需手动刷新页面
- 实时预览配置变化

### 自定义样式

项目使用 Tailwind CSS，你可以：

1. 修改现有组件样式
2. 添加自定义 CSS 类
3. 覆盖默认主题配置

## 常见问题

### Q: 如何添加自定义图标？

A: 在配置文件中设置 `icon` 字段：

```javascript
{
  text: '网站名称',
  link: 'https://example.com',
  icon: '/path/to/icon.svg'  // 或 https://example.com/icon.png
}
```

### Q: 如何修改部署路径？

A: 设置 `base` 字段：

```javascript
export default {
  base: '/my-nav/', // 部署到 yoursite.com/my-nav/
  // ...其他配置
}
```

### Q: 如何支持多语言？

A: 创建多个配置文件，使用不同的构建命令：

```bash
# 英文版
navpress build --config navpress.en.js

# 中文版
navpress build --config navpress.zh.js
```

## 贡献

我们欢迎所有形式的贡献！请阅读我们的[贡献指南](./CONTRIBUTING.md)了解如何提交 Pull Request、报告问题和参与项目开发。

### 快速开始

1. Fork 此仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 进行你的修改
4. 运行测试：`yarn test`
5. 提交更改：`git commit -m 'feat: 添加新功能'`
6. 推送到分支：`git push origin feature/amazing-feature`
7. 创建 Pull Request

## 许可证

MIT License
