# Contributing to NavPress

感谢您对 NavPress 项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🔧 代码贡献
- 🌍 国际化支持

## 📋 目录

- [行为准则](#行为准则)
- [开发环境设置](#开发环境设置)
- [贡献流程](#贡献流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [测试指南](#测试指南)
- [发布流程](#发布流程)

## 🤝 行为准则

本项目采用 [Contributor Covenant](https://www.contributor-covenant.org/version/2/0/code_of_conduct/) 行为准则。参与项目即表示您同意遵守其条款。

## 🛠️ 开发环境设置

### 前置要求

- Node.js >= 18
- Yarn >= 1.22
- Git

### 本地开发设置

1. **克隆仓库**
   ```bash
   git clone https://github.com/aaronlamz/navpress.git
   cd navpress
   ```

2. **安装依赖**
   ```bash
   yarn install
   ```

3. **启动开发服务器**
   ```bash
   yarn dev
   ```

4. **构建项目**
   ```bash
   yarn build
   ```

5. **运行测试**
   ```bash
   yarn test
   ```

6. **代码格式化**
   ```bash
   yarn format
   ```

7. **代码检查**
   ```bash
   yarn lint
   ```

## 🔄 贡献流程

### 1. 创建 Issue

在提交代码之前，建议先创建 Issue 讨论：

- **Bug 报告**: 详细描述问题、复现步骤、期望行为
- **功能建议**: 说明需求、使用场景、预期效果
- **文档问题**: 指出具体位置和改进建议

### 2. Fork 仓库

1. 在 GitHub 上 Fork 本仓库
2. 克隆你的 Fork 到本地

### 3. 创建功能分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 4. 开发代码

- 遵循项目的代码规范
- 编写必要的测试
- 确保代码通过所有检查

### 5. 提交代码

使用规范的提交消息格式：

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in component"
git commit -m "docs: update README"
```

### 6. 推送分支

```bash
git push origin feature/your-feature-name
```

### 7. 创建 Pull Request

1. 在 GitHub 上创建 Pull Request
2. 填写 PR 模板
3. 等待代码审查

## 📝 代码规范

### JavaScript/Vue 规范

- 使用 ES6+ 语法
- 遵循 Vue 3 Composition API 最佳实践
- 使用 TypeScript 类型注解（如果适用）
- 保持函数简洁，单一职责

### CSS 规范

- 使用 Tailwind CSS 类名
- 避免内联样式
- 遵循 BEM 命名约定（自定义样式时）

### 文件组织

```
src/
├── components/          # Vue 组件
├── pages/              # 页面组件
├── utils/              # 工具函数
├── assets/             # 静态资源
├── router/             # 路由配置
└── main.js             # 入口文件
```

### 命名约定

- **文件**: 使用 kebab-case (如: `nav-bar.vue`)
- **组件**: 使用 PascalCase (如: `NavBar`)
- **变量**: 使用 camelCase (如: `userName`)
- **常量**: 使用 UPPER_SNAKE_CASE (如: `API_BASE_URL`)

## 🚀 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 提交示例

```bash
feat: add dark mode support
fix: resolve navigation issue on mobile
docs: update API documentation
style: format code with prettier
refactor: simplify sidebar component
test: add unit tests for utils
chore: update dependencies
```

### 提交范围（可选）

```bash
feat(ui): add new button component
fix(router): resolve navigation bug
docs(api): update endpoint documentation
```

## 🧪 测试指南

### 运行测试

```bash
# 运行所有测试
yarn test

# 运行测试并监听文件变化
yarn test:watch

# 生成测试覆盖率报告
yarn test:coverage
```

### 编写测试

- 为新功能编写测试
- 确保测试覆盖率达到 80% 以上
- 使用描述性的测试名称
- 测试边界情况和错误情况

### 测试文件命名

```
ComponentName.test.js
ComponentName.spec.js
utils.test.js
```

## 📦 发布流程

### 版本管理

我们使用 [Semantic Versioning](https://semver.org/) 版本管理：

- **Major**: 不兼容的 API 修改
- **Minor**: 向下兼容的功能性新增
- **Patch**: 向下兼容的问题修正

### 发布步骤

1. 确保所有测试通过
2. 更新版本号
3. 更新 CHANGELOG
4. 创建 Git 标签
5. 推送到 npm

### 自动发布

项目使用 GitHub Actions 自动发布：

- 提交消息包含 `[deploy]` 时自动触发
- 支持语义化版本控制
- 自动创建 GitHub Release

## 🔍 代码审查

### 审查要点

- 代码质量和可读性
- 功能实现的正确性
- 测试覆盖率
- 文档更新
- 性能影响

### 审查流程

1. 至少需要一名维护者批准
2. 所有 CI 检查必须通过
3. 解决所有审查意见
4. 维护者合并 PR

## 📚 文档贡献

### 文档类型

- README 文件
- API 文档
- 使用教程
- 示例代码
- 故障排除指南

### 文档规范

- 使用清晰的标题结构
- 提供实际的代码示例
- 包含必要的截图或 GIF
- 保持文档的时效性

## 🌍 国际化

### 多语言支持

- 支持中文和英文
- 优先更新英文文档
- 中文文档保持同步

### 翻译指南

- 保持专业术语的一致性
- 考虑文化差异
- 使用本地化的表达方式

## 🆘 获取帮助

### 沟通渠道

- **GitHub Issues**: 功能建议和 Bug 报告
- **GitHub Discussions**: 一般性讨论和问答
- **Pull Requests**: 代码贡献

### 常见问题

**Q: 如何开始贡献？**
A: 从简单的文档改进或 Bug 修复开始，熟悉项目结构和开发流程。

**Q: 代码审查需要多长时间？**
A: 通常在 1-3 个工作日内完成，复杂的功能可能需要更长时间。

**Q: 如何成为维护者？**
A: 通过持续的优质贡献，展示对项目的理解和承诺。

## 🙏 致谢

感谢所有为 NavPress 项目做出贡献的开发者！您的贡献让这个项目变得更好。

---

**注意**: 本指南会随着项目发展而更新。如有疑问，请创建 Issue 或联系维护者。
