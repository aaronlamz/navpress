# 🚀 NavPress 自动部署指南

NavPress 现在支持基于 Git commit message 的自动部署！只需要在提交信息中包含特定标识，GitHub Actions 就会自动发布新版本到 npm。

## 📋 使用方法

### 1. 基础自动部署

在 commit message 中包含 `[deploy]` 或 `deploy:` 即可触发自动部署：

```bash
git commit -m "fix: 修复重定向问题 [deploy]"
git commit -m "deploy: 添加新功能"
```

**默认**: patch 版本增量 (1.0.6 → 1.0.7)

### 2. 指定版本类型

你可以明确指定版本增量类型：

#### Patch 版本 (修复版本)
```bash
git commit -m "fix: 修复bug [deploy:patch]"
git commit -m "deploy:patch - 修复样式问题"
```
**结果**: 1.0.6 → 1.0.7

#### Minor 版本 (功能版本)
```bash
git commit -m "feat: 添加新功能 [deploy:minor]"
git commit -m "deploy:minor - 支持新的配置选项"
```
**结果**: 1.0.6 → 1.1.0

#### Major 版本 (重大更新)
```bash
git commit -m "breaking: 重构API [deploy:major]"
git commit -m "deploy:major - 不兼容的重大变更"
```
**结果**: 1.0.6 → 2.0.0

## 🔧 CI/CD 流程

当你推送包含 deploy 标识的 commit 到 main 分支时，GitHub Actions 会：

1. ✅ **检查 commit message** - 判断是否需要部署
2. 🏗️ **安装依赖** - `npm ci`
3. 🧪 **运行测试** - `npm test` (如果有)
4. 📦 **构建包** - `npm run build`
5. 🔢 **增加版本号** - 根据指定类型
6. 📝 **提交版本变更** - 自动提交 package.json 更改
7. 🏷️ **创建 Git Tag** - v1.0.7 格式
8. 📤 **推送到 GitHub** - 包括 tag
9. 🚀 **发布到 npm** - `npm publish`
10. 📄 **创建 GitHub Release** - 自动生成发布说明

## 📊 示例工作流

```bash
# 1. 开发功能
git add .
git commit -m "feat: 添加暗色主题支持 [deploy:minor]"

# 2. 推送到 main 分支
git push origin main

# 3. GitHub Actions 自动执行：
#    - 检测到 [deploy:minor]
#    - 版本从 1.0.6 → 1.1.0
#    - 发布到 npm
#    - 创建 GitHub Release

# 4. 完成！用户可以安装新版本：
#    npm install navpress@1.1.0
```

## ⚙️ 配置要求

### GitHub Secrets
确保仓库已配置以下 secrets：

- `NPM_ACCESS_TOKEN` - npm 发布令牌 ✅ (已配置)
- `GITHUB_TOKEN` - 自动提供，用于创建 Release

### 权限设置
确保 GitHub Actions 有以下权限：
- `contents: write` - 推送代码和创建 Release
- `actions: write` - 执行 workflow

## 🛡️ 安全特性

1. **只在 main 分支触发** - 保护生产环境
2. **明确的标识要求** - 避免意外发布
3. **自动跳过 CI** - 版本提交使用 `[skip ci]` 避免循环
4. **完整的日志** - 每步都有详细输出

## 📝 Commit Message 模式

支持以下所有格式：

### 方括号格式
```
[deploy]        # patch
[deploy:patch]  # patch  
[deploy:minor]  # minor
[deploy:major]  # major
```

### 冒号格式
```
deploy:         # patch
deploy:patch    # patch
deploy:minor    # minor  
deploy:major    # major
```

### 组合示例
```bash
# 修复 + 部署
git commit -m "fix: 修复导航栏样式问题 [deploy]"

# 功能 + 部署  
git commit -m "feat: 添加搜索功能 [deploy:minor]"

# 重构 + 部署
git commit -m "refactor: 重构路由系统 [deploy:major]"

# 直接部署格式
git commit -m "deploy:patch - 紧急修复"
git commit -m "deploy:minor - 发布新功能"
```

## 🚫 不会触发部署的情况

以下 commit 不会触发自动部署：

```bash
git commit -m "fix: 修复样式问题"           # 没有 deploy 标识
git commit -m "feat: 添加新功能"            # 没有 deploy 标识  
git commit -m "docs: 更新文档"              # 没有 deploy 标识
git commit -m "chore: 更新依赖"             # 没有 deploy 标识
```

## 📞 故障排除

### 如果自动部署失败：

1. **检查 GitHub Actions 日志** - 查看具体错误
2. **确认 NPM_ACCESS_TOKEN** - 验证 token 有效性
3. **检查权限** - 确保有推送权限
4. **版本冲突** - 确保版本号未被占用

### 手动发布备选方案：

```bash
# 如果自动部署失败，可以手动发布
npm run release:patch   # 或 release:minor, release:major
```

## 🎯 最佳实践

1. **明确的提交信息** - 清楚描述变更内容
2. **适当的版本类型** - 根据变更影响选择正确类型
3. **测试后再部署** - 确保功能正常后再加 deploy 标识
4. **批量变更** - 将相关变更合并为一个 commit 再部署

现在你可以更高效地管理 NavPress 的发布流程了！🎉
