# NavPress

[![npm version](https://img.shields.io/npm/v/navpress.svg)](https://www.npmjs.com/package/navpress)
[![Deploy to GitHub Pages](https://github.com/aaronlamz/navpress/actions/workflows/deploy.yml/badge.svg)](https://github.com/aaronlamz/navpress/actions/workflows/deploy.yml)

> [简体中文](./README_zh.md) | English

**NavPress** is a CLI tool for generating static navigation websites. It allows you to quickly build a navigation site through a configuration file, supporting both development and production modes.

## Features

- 🎯 **Simple Configuration**: Define your navigation and sidebar through a single configuration file
- ⚡ **Hot Reload**: Configuration changes apply instantly during development
- 🏗️ **Production Ready**: Built-in SSR support, automatically generates static HTML files
- 🎨 **Modern Stack**: Built with Vue.js and Tailwind CSS
- 📱 **Responsive Design**: Perfect for desktop and mobile devices
- 🔗 **Flexible Routing**: Support multiple URL formats (query, path, hash)
- 🖼️ **Built-in Icons**: Default icons included, custom icons supported

## Preview

[View Demo](https://aaronlamz.github.io/navpress/)

## Installation

### Global Installation

```bash
npm install -g navpress@latest
```

### Local Installation

```bash
npm install navpress@latest --save-dev
```

## Quick Start

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

## Configuration

### Basic Configuration

| Field         | Type   | Description                         |
| ------------- | ------ | ----------------------------------- |
| `title`       | string | Website title                       |
| `description` | string | Website description                 |
| `logo`        | string | Logo image path                     |
| `base`        | string | Base deployment path, default '/'   |
| `urlFormat`   | string | URL format: 'query', 'path', 'hash' |

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

## Deployment

### GitHub Pages

1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Select `gh-pages` branch as source
4. Modify `navpress.config.js` with your configuration

### Other Static Hosting

```bash
# Build
navpress build

# Deploy dist directory to any static hosting service
# Like Netlify, Vercel, GitHub Pages, etc.
```

## Development

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

## FAQ

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

## Contributing

Issues and Pull Requests are welcome!

## License

MIT License
# 触发构建 - 2025年 8月22日 星期五 10时18分46秒 CST
