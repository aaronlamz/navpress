// navpress.config.js
export default {
  title: '我的导航站',
  description: 'A simple static site generator with configurable navigation',
  logo: '/images/logo.svg',
  github: 'https://github.com/aaronlamz/navpress',
  base: '/',
  urlFormat: 'query', // 'query' | 'path' | 'hash'

  meta: {
    title: 'NavPress - Static Site Generator',
    description: 'A simple static site generator with configurable navigation',
    keywords: 'static site, generator, navpress, vue, navigation',
    author: 'aaronlamz',
  },

  sidebar: [
    {
      text: '前端开发',
      link: '/',
      items: [
        {
          text: '框架工具',
          link: '#frameworks',
          items: [
            {
              text: 'Vue.js',
              link: 'https://vuejs.org',
              icon: 'https://vuejs.org/images/logo.png',
              description: '渐进式 JavaScript 框架',
            },
            {
              text: 'React',
              link: 'https://reactjs.org',
              icon: 'https://reactjs.org/favicon.ico',
              description: '用于构建用户界面的 JavaScript 库',
            },
            {
              text: 'Angular',
              link: 'https://angular.io',
              description: '现代化的 Web 开发平台',
            },
            {
              text: 'Svelte',
              link: 'https://svelte.dev',
              description: '构建更快的 Web 应用程序',
            },
          ],
        },
        {
          text: '构建工具',
          link: '#build-tools',
          items: [
            {
              text: 'Vite',
              link: 'https://vitejs.dev',
              icon: 'https://vitejs.dev/logo.svg',
              description: '下一代前端构建工具',
            },
            {
              text: 'Webpack',
              link: 'https://webpack.js.org',
              description: '静态模块打包器',
            },
            {
              text: 'Rollup',
              link: 'https://rollupjs.org',
              description: 'JavaScript 模块打包器',
            },
            {
              text: 'Parcel',
              link: 'https://parceljs.org',
              description: '零配置 Web 应用打包器',
            },
          ],
        },
        {
          text: 'CSS 框架',
          link: '#css-frameworks',
          items: [
            {
              text: 'Tailwind CSS',
              link: 'https://tailwindcss.com',
              description: '实用程序优先的 CSS 框架',
            },
            {
              text: 'Bootstrap',
              link: 'https://getbootstrap.com',
              description: '世界上最流行的前端框架',
            },
            {
              text: 'Bulma',
              link: 'https://bulma.io',
              description: '基于 Flexbox 的现代 CSS 框架',
            },
          ],
        },
      ],
    },
    {
      text: '后端开发',
      link: '/backend',
      items: [
        {
          text: 'Node.js',
          link: '#nodejs',
          items: [
            {
              text: 'Express.js',
              link: 'https://expressjs.com',
              description: '快速、简洁的 Node.js Web 框架',
            },
            {
              text: 'Nest.js',
              link: 'https://nestjs.com',
              icon: 'https://nestjs.com/img/logo-small.svg',
              description: '构建高效、可扩展的 Node.js 服务器端应用',
            },
            {
              text: 'Koa.js',
              link: 'https://koajs.com',
              description: '下一代 Node.js Web 框架',
            },
          ],
        },
        {
          text: 'Python',
          link: '#python',
          items: [
            {
              text: 'Django',
              link: 'https://www.djangoproject.com',
              description: 'Python Web 框架',
            },
            {
              text: 'Flask',
              link: 'https://flask.palletsprojects.com',
              description: '轻量级 Python Web 框架',
            },
            {
              text: 'FastAPI',
              link: 'https://fastapi.tiangolo.com',
              description: '现代、快速的 Python Web 框架',
            },
          ],
        },
        {
          text: '数据库',
          link: '#database',
          items: [
            {
              text: 'MongoDB',
              link: 'https://www.mongodb.com',
              description: '文档型数据库',
            },
            {
              text: 'PostgreSQL',
              link: 'https://www.postgresql.org',
              description: '先进的开源关系型数据库',
            },
            {
              text: 'Redis',
              link: 'https://redis.io',
              description: '内存数据结构存储',
            },
            {
              text: 'MySQL',
              link: 'https://www.mysql.com',
              description: '世界上最流行的开源数据库',
            },
          ],
        },
      ],
    },
    {
      text: '设计资源',
      link: '/design',
      items: [
        {
          text: '设计工具',
          link: '#design-tools',
          items: [
            {
              text: 'Figma',
              link: 'https://www.figma.com',
              description: '协作设计工具',
            },
            {
              text: 'Sketch',
              link: 'https://www.sketch.com',
              description: 'macOS 设计工具',
            },
            {
              text: 'Adobe XD',
              link: 'https://www.adobe.com/products/xd.html',
              description: 'Adobe 用户体验设计工具',
            },
          ],
        },
        {
          text: '图标素材',
          link: '#icons',
          items: [
            {
              text: 'Font Awesome',
              link: 'https://fontawesome.com',
              description: '网络上最流行的图标工具包',
            },
            {
              text: 'Heroicons',
              link: 'https://heroicons.com',
              description: 'Tailwind CSS 制作者出品的图标库',
            },
            {
              text: 'Feather Icons',
              link: 'https://feathericons.com',
              description: '简洁漂亮的开源图标',
            },
          ],
        },
        {
          text: '色彩工具',
          link: '#colors',
          items: [
            {
              text: 'Coolors',
              link: 'https://coolors.co',
              description: '快速配色方案生成器',
            },
            {
              text: 'Adobe Color',
              link: 'https://color.adobe.com',
              description: 'Adobe 配色工具',
            },
          ],
        },
      ],
    },
    {
      text: '开发工具',
      link: '/tools',
      items: [
        {
          text: '代码编辑器',
          link: '#editors',
          items: [
            {
              text: 'VS Code',
              link: 'https://code.visualstudio.com',
              description: '微软开源代码编辑器',
            },
            {
              text: 'WebStorm',
              link: 'https://www.jetbrains.com/webstorm',
              description: 'JetBrains 开发的智能 JavaScript IDE',
            },
            {
              text: 'Sublime Text',
              link: 'https://www.sublimetext.com',
              description: '轻量级文本编辑器',
            },
          ],
        },
        {
          text: '版本控制',
          link: '#version-control',
          items: [
            {
              text: 'GitHub',
              link: 'https://github.com',
              description: '全球最大的代码托管平台',
            },
            {
              text: 'GitLab',
              link: 'https://gitlab.com',
              description: 'DevOps 平台',
            },
            {
              text: 'Bitbucket',
              link: 'https://bitbucket.org',
              description: 'Atlassian 的 Git 代码管理工具',
            },
          ],
        },
        {
          text: 'API 工具',
          link: '#api-tools',
          items: [
            {
              text: 'Postman',
              link: 'https://www.postman.com',
              description: 'API 开发环境',
            },
            {
              text: 'Insomnia',
              link: 'https://insomnia.rest',
              description: 'API 客户端和设计工具',
            },
            {
              text: 'Swagger',
              link: 'https://swagger.io',
              description: 'API 开发工具集',
            },
          ],
        },
      ],
    },
    {
      text: '学习资源',
      link: '/learning',
      items: [
        {
          text: '文档网站',
          link: '#docs',
          items: [
            {
              text: 'MDN Web Docs',
              link: 'https://developer.mozilla.org',
              description: 'Web 技术权威文档',
            },
            {
              text: 'W3Schools',
              link: 'https://www.w3schools.com',
              description: 'Web 开发教程网站',
            },
            {
              text: 'DevDocs',
              link: 'https://devdocs.io',
              description: '多合一 API 文档浏览器',
            },
          ],
        },
        {
          text: '在线课程',
          link: '#courses',
          items: [
            {
              text: 'freeCodeCamp',
              link: 'https://www.freecodecamp.org',
              description: '免费编程学习平台',
            },
            {
              text: 'Codecademy',
              link: 'https://www.codecademy.com',
              description: '交互式编程学习平台',
            },
            {
              text: 'Coursera',
              link: 'https://www.coursera.org',
              description: '在线课程平台',
            },
          ],
        },
        {
          text: '技术博客',
          link: '#blogs',
          items: [
            {
              text: 'DEV Community',
              link: 'https://dev.to',
              description: '开发者社区',
            },
            {
              text: 'Medium',
              link: 'https://medium.com',
              description: '内容创作平台',
            },
            {
              text: 'Hacker News',
              link: 'https://news.ycombinator.com',
              description: '科技新闻聚合网站',
            },
          ],
        },
      ],
    },
  ],
}
