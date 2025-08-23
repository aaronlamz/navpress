# NavPress

[![npm version](https://img.shields.io/npm/v/navpress.svg)](https://www.npmjs.com/package/navpress)
[![npm downloads](https://img.shields.io/npm/dm/navpress.svg)](https://www.npmjs.com/package/navpress)
[![GitHub stars](https://img.shields.io/github/stars/aaronlamz/navpress.svg)](https://github.com/aaronlamz/navpress)
[![License](https://img.shields.io/npm/l/navpress.svg)](https://github.com/aaronlamz/navpress/blob/main/LICENSE)

> [简体中文](./README_zh.md) | English

**NavPress** is a powerful CLI tool for generating beautiful static navigation websites. Build your personal navigation site in minutes with a simple configuration file. Perfect for developers, teams, and anyone who wants to organize their favorite links.

## ✨ Features

- 🎯 **Simple Configuration**: Define your navigation and sidebar through a single configuration file
- ⚡ **Hot Reload**: Configuration changes apply instantly during development
- 🏗️ **Production Ready**: Built-in SSR support, automatically generates static HTML files
- 🎨 **Modern Stack**: Built with Vue.js 3 and Tailwind CSS
- 📱 **Responsive Design**: Perfect for desktop and mobile devices
- 🔗 **Flexible Routing**: Support multiple URL formats (query, path, hash)
- 🖼️ **Built-in Icons**: Default icons included, custom icons supported
- 🚀 **CLI Tool**: Easy-to-use command line interface
- 📦 **Zero Dependencies**: Lightweight and fast
- 🔄 **Automated CI/CD**: GitHub Actions for automatic npm publishing and GitHub Pages deployment

## Preview

[View Demo](https://aaronlamz.github.io/navpress/)

## 🚀 Installation

### Quick Install

```bash
npm install -g navpress@latest
```

### Alternative Installation Methods

```bash
# Using yarn
yarn global add navpress@latest

# Using pnpm
pnpm add -g navpress@latest

# Local development
npm install navpress@latest --save-dev
```

### Verify Installation

```bash
navpress --version
# Output: navpress@1.1.5
```

## 🚀 Quick Start

### 1. Create Configuration File

Create `navpress.config.js` in your project root:

```javascript
export default {
  title: 'My Navigation',
  description: 'Personal website navigation',
  logo: '/images/logo.svg',
  base: '/',

  sidebar: [
    {
      text: 'Development Tools',
      link: '/tools',
      items: [
        {
          text: 'Frontend Frameworks',
          link: '#frameworks',
          items: [
            {
              text: 'Vue.js',
              link: 'https://vuejs.org',
              description: 'Progressive JavaScript Framework',
            },
            {
              text: 'React',
              link: 'https://reactjs.org',
              description: 'JavaScript library for building user interfaces',
            },
          ],
        },
      ],
    },
  ],
}
```

### 2. Start Development Server

```bash
# If installed globally
navpress dev

# If installed locally
npx navpress dev
```

### 3. Build for Production

```bash
# Build static files
navpress build

# Built files will be in dist directory
```

## ⚙️ Configuration

### Basic Configuration

| Field         | Type   | Description                         | Default              |
| ------------- | ------ | ----------------------------------- | -------------------- |
| `title`       | string | Website title                       | `NavPress`           |
| `description` | string | Website description                 | `Navigation Website` |
| `logo`        | string | Logo image path                     | `/images/logo.svg`   |
| `base`        | string | Base deployment path                | `/`                  |
| `urlFormat`   | string | URL format: 'query', 'path', 'hash' | `query`              |

### Sidebar Configuration

```javascript
sidebar: [
  {
    text: 'Category Name',
    link: '/category', // Category page path
    icon: '/icon.svg', // Optional: custom icon
    items: [
      {
        text: 'Sub Group',
        link: '#section', // Anchor link
        items: [
          {
            text: 'Website Name',
            link: 'https://example.com',
            icon: '/site-icon.svg', // Optional
            description: 'Website description', // Optional
          },
        ],
      },
    ],
  },
]
```

### URL Format Options

- **query** (Recommended): `/tools?section=frameworks` - Uses query parameters
- **path**: `/tools/frameworks` - Uses path parameters
- **hash**: `/tools#frameworks` - Uses hash parameters

## 🚀 Deployment

### Quick Deploy

```bash
# Build your site
navpress build

# Deploy to any static hosting service
# The built files are in the `dist` directory
```

### Popular Hosting Options

#### GitHub Pages

1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Select `gh-pages` branch as source
4. Modify `navpress.config.js` with your configuration

#### Netlify

```bash
# Build and deploy
navpress build
# Drag and drop the `dist` folder to Netlify
```

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
navpress build
vercel --prod
```

#### Any Static Hosting

```bash
navpress build
# Upload the `dist` directory to your hosting service
```

## 🛠️ Development

### Development Commands

```bash
# Start development server with hot reload
navpress dev

# Build for production
navpress build

# Preview production build
navpress serve

# Run linting
yarn lint

# Format code
yarn format
```

### Hot Reload

Development mode supports configuration hot reload:

- Modify `navpress.config.js` and changes apply automatically
- No need to manually refresh the page
- Real-time preview of configuration changes

### Custom Styling

This project uses Tailwind CSS. You can:

1. Modify existing component styles
2. Add custom CSS classes
3. Override default theme configuration

### Project Structure

```
navpress/
├── src/
│   ├── components/     # Vue components
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   └── assets/        # Static assets
├── public/            # Public assets
├── navpress.config.js # Configuration file
└── package.json       # Dependencies
```

## ❓ FAQ

### How to add custom icons?

Set the `icon` field in configuration:

```javascript
{
  text: 'Website Name',
  link: 'https://example.com',
  icon: '/path/to/icon.svg'  // or https://example.com/icon.png
}
```

### How to change deployment path?

Set the `base` field:

```javascript
export default {
  base: '/my-nav/', // Deploy to yoursite.com/my-nav/
  // ...other config
}
```

### How to support multiple languages?

Create multiple configuration files and use different build commands:

```bash
# English version
navpress build --config navpress.en.js

# Chinese version
navpress build --config navpress.zh.js
```

### How to update NavPress?

```bash
# Update to latest version
npm update -g navpress@latest

# Or reinstall
npm install -g navpress@latest
```

### How to uninstall NavPress?

```bash
npm uninstall -g navpress
```

### How to check NavPress version?

```bash
navpress --version
# or
npm list -g navpress
```

## 🚀 CI/CD Pipeline

NavPress uses GitHub Actions for automated deployment and publishing:

### Trigger Conditions

- **📦 npm Publishing**: Include `publish` in your commit message
  ```bash
  git commit -m "feat: add new feature [publish]"
  ```
- **🌐 GitHub Pages**: Include `deploy` in your commit message
  ```bash
  git commit -m "docs: update documentation [deploy]"
  ```
- **🔄 Regular Commits**: No special identifier needed (won't trigger deployment)

### Workflow Steps

1. **npm Publishing** (`publish` identifier):

   - Bumps version automatically
   - Publishes to npm registry
   - Creates GitHub release
   - Tags the release

2. **GitHub Pages** (`deploy` identifier):
   - Builds the project
   - Deploys to GitHub Pages
   - Updates live demo site

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `yarn test`
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Setup

```bash
# Clone and setup
git clone https://github.com/aaronlamz/navpress.git
cd navpress
yarn install

# Start development
yarn dev
```

### Report Issues

Found a bug? Have a feature request? Please [create an issue](https://github.com/aaronlamz/navpress/issues) and we'll get back to you!

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

If you find NavPress helpful, please consider:

- ⭐ Starring this repository
- 📦 Installing from npm: `npm install -g navpress@latest`
- 🐛 Reporting bugs or suggesting features
- 🤝 Contributing code or documentation

---

**Made with ❤️ by [aaronlamz](https://github.com/aaronlamz)**
