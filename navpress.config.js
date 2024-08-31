// config/index.js
export default {
  title: '我的开发导航',
  description: 'A simple static site generator with configurable navigation',
  logo: '/navpress/images/logo.svg',
  github: 'https://github.com/aaronlamz/navpress',
  base: '/navpress/',
  meta: {
    title: 'My Navpress',
    description:
      'Navpress - a simple static site generator with configurable navigation',
    keywords: 'static site, generator, navpress, vue',
    author: 'aaronlamz',
  },
  sidebar: [
    {
      text: 'Web',
      link: '/',
      items: [
        {
          text: '前端',
          link: '#group1',
          items: [
            { text: 'Child 1', link: 'https://example.com/child1' },
            { text: 'Child 2', link: 'https://example.com/child2' },
            { text: 'Child 2', link: 'https://example.com/child2' },
          ],
        },
        {
          text: '设计',
          link: '#group2',
          items: [
            { text: 'Child 3', link: 'https://example.com/child3' },
            { text: 'Child 4', link: 'https://example.com/child4' },
            { text: 'Child 2', link: 'https://example.com/child2' },
          ],
        },
      ],
    },
    {
      text: '效率工具',
      link: '/efficient',
      expanded: true,
      items: [
        {
          text: 'Group A',
          link: '#groupA',
          items: [{ text: 'Child A1', link: 'https://example.com/childA1' }],
        },
      ],
    },
    {
      text: 'AI 资源',
      link: '/ai',
      expanded: true,
      items: [
        {
          text: 'Group A',
          link: '#groupA',
          items: [{ text: 'Child A1', link: 'https://example.com/childA1' }],
        },
      ],
    },
    {
      text: '副业有道',
      link: '/second-job',
      expanded: true,
      items: [
        {
          text: 'Group A',
          link: '#groupA',
          items: [{ text: 'Child', link: 'https://example.com/childA1' }],
        },
      ],
    },
  ],
}
