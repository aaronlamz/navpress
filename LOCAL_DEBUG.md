# NavPress 本地调试指南

这个文档介绍了如何在不发布 npm 包的情况下，在其他项目中调试 NavPress 的修改。

## 🚀 快速开始

### 方法 1: 符号链接方式 (推荐)

在 NavPress 项目中运行：

```bash
# 创建符号链接到目标项目
node scripts/link-local.js /path/to/your/project

# 或者使用默认路径 (pintree-nav)
node scripts/link-local.js
```

然后在目标项目中：

```bash
cd /path/to/your/project
yarn dev  # 或 npm run dev
```

**优点**：

- 修改 NavPress 代码立即生效
- 支持热更新
- 最接近真实使用环境

### 方法 2: 远程调试方式

直接在目标项目中运行：

```bash
# 在目标项目目录中
node /path/to/navpress/scripts/debug-remote.js dev

# 指定配置文件
node /path/to/navpress/scripts/debug-remote.js dev ./navpress.config.js
```

**优点**：

- 不需要修改 node_modules
- 可以测试不同配置文件
- 适合快速验证

### 方法 3: 本地测试工具

在 NavPress 项目中快速测试：

```bash
# 测试指定配置文件
node scripts/test-local.js /path/to/other/project/navpress.config.js

# 使用默认配置文件路径
node scripts/test-local.js
```

**优点**：

- 最快速的测试方式
- 适合验证配置文件兼容性

## 🔧 问题排查

### 重定向循环 (ERR_TOO_MANY_REDIRECTS)

如果遇到重定向循环，检查：

1. **Base 路径配置**：确保 `navpress.config.js` 中的 `base` 路径正确
2. **访问 URL**：直接访问完整 URL (如 `http://localhost:5173/admin/docs/navpress/`)
3. **清除缓存**：清除浏览器缓存和 Cookie

### 404 错误

1. **检查路径**：确保 base 路径配置正确
2. **SPA fallback**：确保 SPA 路由被正确重写到 `index.html`
3. **静态资源**：检查静态资源路径是否正确

### 配置文件不生效

1. **热更新**：修改配置文件后应该自动更新
2. **手动刷新**：如果自动更新失败，手动刷新浏览器
3. **重启服务器**：如果问题持续，重启开发服务器

## 🧹 清理

### 移除符号链接

```bash
# 恢复到 npm 包版本
node scripts/unlink-local.js /path/to/your/project

# 或者使用默认路径
node scripts/unlink-local.js
```

### 手动清理

如果脚本失败，可以手动清理：

```bash
# 删除符号链接
rm /path/to/your/project/node_modules/navpress

# 重新安装
cd /path/to/your/project
yarn install  # 或 npm install
```

## 📝 配置示例

### 典型的 navpress.config.js

```javascript
export default {
  title: '测试项目',
  description: '本地调试测试',
  base: '/admin/docs/navpress/', // 重要：确保这个路径正确
  urlFormat: 'query', // 或 'hash', 'path'
  sidebar: [
    {
      name: '开发工具',
      link: '/dev',
      groups: [
        {
          name: '前端框架',
          items: [
            {
              name: 'Vue.js',
              url: 'https://vuejs.org/',
              description: 'Vue.js 官网',
            },
          ],
        },
      ],
    },
  ],
}
```

## 🔄 开发流程

1. **在 NavPress 中修改代码**
2. **创建符号链接** (`node scripts/link-local.js`)
3. **在目标项目中启动** (`yarn dev`)
4. **测试修改效果**
5. **完成后清理** (`node scripts/unlink-local.js`)
6. **发布新版本** (`npm run release:patch`)

## 💡 提示

- 符号链接方式最适合日常开发
- 远程调试方式适合快速验证
- 测试工具适合CI/CD环境
- 始终在完成调试后清理符号链接
- 发布前在干净环境中测试
