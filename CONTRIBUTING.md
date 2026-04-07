# Contributing to NavPress

感谢您对 NavPress 项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🔧 代码贡献
- 🌍 国际化支持

## 📋 目录

- [开发环境设置](#开发环境设置)
- [本地开发与验证](#本地开发与验证)
- [贡献流程](#贡献流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [发布流程](#发布流程)

## 🛠️ 开发环境设置

### 前置要求

- Node.js >= 18
- npm >= 8 或 Yarn >= 1.22
- Git

### 克隆与安装

```bash
git clone https://github.com/aaronlamz/navpress.git
cd navpress
npm install
```

## 🔧 本地开发与验证

### 架构说明

NavPress 采用**预构建 + 运行时注入**的架构：

- 开发者在 `src/` 中编写 Vue 组件和样式
- `npm run build` 将源码编译为 `dist/`（预构建产物）
- 用户安装 navpress 后，CLI（`bin/navpress.mjs`）直接使用 `dist/` 中的预构建文件，**不再从源码编译**
- 用户的 `navpress.config.js` 在运行时注入到预构建的 HTML 中

因此，贡献者需要通过**三个阶段**验证改动：

```
源码开发（Vite HMR）→ 构建 dist/ → 用 CLI 验证（和用户体验一致）
```

### 阶段一：源码开发（快速迭代）

使用 Vite 开发服务器，修改 Vue 组件/样式时享受 HMR 热更新：

```bash
npm run dev
```

这会从 `src/` 源码启动 Vite，使用仓库根目录的 `navpress.config.js` 作为演示数据。

**验证要点：**
- 页面正常渲染（侧边栏、导航栏、卡片列表）
- 修改 Vue 组件/CSS 后页面热更新
- 暗色模式、移动端响应式正常

### 阶段二：预览模式（一键验证用户体验）

改完源码后，用一条命令构建 dist/ 并以 CLI 模式服务，**效果和用户 `npm install navpress` 后完全一致**：

```bash
npm run preview
```

这等价于 `npm run build && node bin/navpress.mjs dev`。它会：
1. 用 Vite 将 `src/` 编译为 `dist/`
2. 用 CLI 的轻量 HTTP server 服务 `dist/`（和用户使用的是同一套代码路径）

**验证要点：**
- 页面正常渲染，样式完整（Tailwind 类生效、无丢失）
- 配置注入正确（标题、侧边栏数据）
- 修改 `navpress.config.js` 后页面自动刷新
- 卡片文字不溢出容器

> 如果阶段一和阶段二效果不一致，说明预构建过程有问题，需要排查 `vite.config.js` 或 `prerender.cjs`。

### 阶段三：npm link 模式（跨项目集成验证）

模拟真实用户在独立项目中安装使用 navpress 的体验：

```bash
# 1. 在 navpress 仓库构建并创建全局链接
npm run build
npm link

# 2. 在消费项目中使用链接
cd /path/to/your-nav-project
npm link navpress

# 3. 运行 CLI 命令
npx navpress dev     # 开发服务器
npx navpress build   # 构建静态站点

# 4. 验证完成后清理
npm unlink navpress && npm install
```

**验证要点：**
- CLI 命令正常执行，配置被正确加载（检查终端日志）
- `base` 路径配置生效（如 `/admin/docs/navpress/`）
- 构建产物 `dist/index.html` 中 `window.__USER_CONFIG__` 包含完整配置
- 资源路径（JS/CSS/图片）匹配 `base` 配置

### 快速验证 Checklist

发布前按顺序完成：

```
□ 阶段一：源码开发
  □ npm run dev — 页面正常渲染
  □ 修改 Vue 组件 — HMR 生效

□ 阶段二：预览模式（关键！）
  □ npm run preview — 页面正常、样式完整
  □ 修改 navpress.config.js — 配置热重载生效
  □ 刷新浏览器 — 配置不回退

□ 阶段三：npm link（可选，发布大版本时推荐）
  □ npx navpress dev — 正确加载消费项目配置
  □ npx navpress build — 构建无报错
  □ 检查 dist/index.html — 资源路径和配置正确
```

### 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `navpress: command not found` | 全局链接未生效 | 重新执行 `npm link` |
| 预览模式样式和开发不一致 | Tailwind purge 去掉了动态类 | 检查 `tailwind.config.cjs` 的 `content` 路径 |
| 配置文件未找到 | CLI 未正确解析路径 | 确保从消费项目根目录运行命令 |
| 热重载不生效 | 文件监听器未检测到变化 | 检查终端是否有 `Config file changed` 日志 |
| `base` 路径下页面 404 | SPA fallback 未生效 | 确认 `base` 字段以 `/` 结尾 |
| 资源加载 404 | dist/ 中 base 路径未替换 | 检查 `bin/navpress.mjs` 的 `buildHtml` 函数 |

## 🔄 贡献流程

### 1. 创建 Issue

在提交代码之前，建议先创建 Issue 讨论：

- **Bug 报告**: 详细描述问题、复现步骤、期望行为
- **功能建议**: 说明需求、使用场景、预期效果

### 2. 创建功能分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 3. 开发与验证

按照上述「本地开发与验证」完成 Demo 模式和 npm link 模式的测试。

### 4. 提交代码

使用规范的提交消息格式（详见提交规范）：

```bash
git commit -m "feat: add new feature"
```

### 5. 创建 Pull Request

推送分支后在 GitHub 上创建 PR。

## 📝 代码规范

### JavaScript/Vue 规范

- 使用 ES6+ 语法
- 遵循 Vue 3 Composition API 最佳实践
- 保持函数简洁，单一职责

### CSS 规范

- 优先使用 Tailwind CSS 类名
- 避免内联样式
- 自定义样式放在组件的 `<style scoped>` 中

### 文件组织

```
navpress/
├── bin/
│   └── navpress.mjs          # CLI 入口
├── src/
│   ├── main.js               # 应用入口（配置加载 + HMR）
│   ├── App.vue               # 根组件（布局）
│   ├── components/            # Vue 组件
│   │   ├── Navbar.vue
│   │   ├── Sidebar.vue
│   │   ├── FooterComponent.vue
│   │   └── ConfigStatus.vue   # 开发模式配置调试
│   ├── pages/
│   │   └── LinksPage.vue      # 链接卡片页面
│   ├── router/
│   │   └── index.js           # Vue Router 配置
│   ├── utils/
│   │   └── urlHelper.js       # URL 生成工具
│   ├── assets/
│   │   ├── style/index.css    # Tailwind 入口
│   │   └── icons/             # 默认图标
│   └── node/
│       └── prerender.cjs      # SSR 预渲染
├── public/                    # 静态资源
├── vite.config.js             # Vite 构建配置（含热重载插件）
├── tailwind.config.cjs        # Tailwind CSS 配置
├── navpress.config.js         # 演示用配置文件
├── index.html                 # HTML 模板
└── package.json
```

## 🚀 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

| 类型       | 说明                     |
|------------|--------------------------|
| `feat`     | 新功能                   |
| `fix`      | Bug 修复                 |
| `docs`     | 文档更新                 |
| `style`    | 代码格式调整             |
| `refactor` | 代码重构                 |
| `test`     | 测试相关                 |
| `chore`    | 构建过程或辅助工具的变动 |

```bash
feat: add dark mode support
fix: resolve navigation issue on mobile
docs: update API documentation
```

## 📦 发布流程

### 版本管理

使用 [Semantic Versioning](https://semver.org/)：

- **Major**: 不兼容的 API 修改
- **Minor**: 向下兼容的功能性新增
- **Patch**: 向下兼容的问题修正

### 发布前 Checklist

1. 完成上述「快速验证 Checklist」中的所有项目
2. 代码通过 lint 检查：`npm run lint`
3. 代码已格式化：`npm run format`

### 手动发布

```bash
# Patch 版本（bug fix）
npm run release:patch

# Minor 版本（新功能）
npm run release:minor

# Major 版本（破坏性变更）
npm run release:major
```

### 自动发布（CI/CD）

通过 GitHub Actions 自动发布，在 commit message 中包含特定标识：

- **npm 发布**：commit message 包含 `publish`
  ```bash
  git commit -m "feat: add new feature [publish]"
  ```
- **GitHub Pages 部署**：commit message 包含 `deploy`
  ```bash
  git commit -m "docs: update demo [deploy]"
  ```

## 🆘 获取帮助

- **GitHub Issues**: 功能建议和 Bug 报告
- **GitHub Discussions**: 一般性讨论和问答
- **Pull Requests**: 代码贡献

---

**注意**: 本指南会随着项目发展而更新。如有疑问，请创建 Issue 或联系维护者。
