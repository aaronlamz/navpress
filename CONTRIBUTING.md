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

NavPress 有两种开发验证场景：**Demo 模式**（验证 navpress 自身功能）和 **npm link 模式**（模拟真实用户安装后的使用体验）。两种都需要验证通过才能发布。

### 场景一：Demo 模式（开发 navpress 自身）

直接在 navpress 仓库中运行，使用内置的 `navpress.config.js` 作为演示数据：

```bash
# 启动开发服务器（使用仓库根目录的 navpress.config.js）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run serve
```

**验证要点：**
- 页面正常渲染，侧边栏、导航栏、卡片列表显示正确
- 修改 `navpress.config.js` 后页面自动热更新（无需手动刷新）
- 刷新页面后配置仍为最新值
- 暗色模式切换正常
- 移动端响应式布局正常
- 构建产物 `dist/` 中的 HTML 包含正确的 meta 和配置数据

### 场景二：npm link 模式（模拟用户安装使用）

这是验证发布后用户体验的关键步骤。通过 `npm link` 将本地 navpress 链接到一个消费项目中，模拟从 npm 安装后的行为。

#### 步骤 1：创建全局链接

```bash
# 在 navpress 仓库根目录
cd /path/to/navpress
npm link
```

#### 步骤 2：在消费项目中使用链接

```bash
# 在消费项目目录（如 pintree-nav）
cd /path/to/your-nav-project
npm link navpress
```

> 此时 `node_modules/navpress` 是一个指向你本地 navpress 仓库的 symlink，修改 navpress 源码后消费项目立即生效。

#### 步骤 3：运行与验证

```bash
# 开发模式
npx navpress dev

# 构建
npx navpress build
```

**验证要点：**
- CLI 命令 `navpress dev` / `navpress build` 正常执行
- 用户项目的 `navpress.config.js` 被正确加载（检查终端日志）
- `base` 路径配置生效（如 `/admin/docs/navpress/`）
- 配置文件修改后热重载正常工作
- 构建产物中样式完整（Tailwind CSS 类正确生成）
- 卡片文字不溢出容器
- 生产构建的 HTML 中 `window.__USER_CONFIG__` 包含完整配置

#### 步骤 4：清理链接

验证完成后，恢复消费项目的 npm 依赖：

```bash
# 在消费项目中取消链接
cd /path/to/your-nav-project
npm unlink navpress
npm install

# 在 navpress 仓库取消全局链接（可选）
cd /path/to/navpress
npm unlink
```

### 快速验证 Checklist

在发布前，按顺序完成以下验证：

```
□ Demo 模式
  □ npm run dev — 页面正常加载
  □ 修改 navpress.config.js — 热重载生效
  □ 刷新浏览器 — 配置不回退
  □ npm run build — 构建无报错
  □ npm run serve — 预览页面正常

□ npm link 模式（消费项目）
  □ npx navpress dev — 正确加载用户配置
  □ base 路径正确（如果配置了非 / 路径）
  □ 修改用户 navpress.config.js — 热重载生效
  □ 刷新浏览器 — 配置不回退
  □ npx navpress build — 构建无报错
  □ 检查 dist/index.html — 样式和配置数据完整
```

### 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `navpress: command not found` | 全局链接未生效 | 重新执行 `npm link` |
| 配置文件未找到 | `WORKING_DIR` 未正确设置 | 确保从消费项目根目录运行命令 |
| 样式丢失/Tailwind 类无效 | PostCSS 配置冲突 | 确认消费项目没有自己的 `postcss.config.js` |
| 热重载不生效 | 文件监听器未检测到变化 | 检查终端是否有 `Config file changed` 日志 |
| 刷新后配置回退 | `/__navpress_config` 端点异常 | 在浏览器中直接访问该端点确认返回最新配置 |
| `base` 路径下页面 404 | SPA fallback 未正确配置 | 确认 `navpress.config.js` 中 `base` 字段以 `/` 结尾 |

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
