// config/index.js
export default {
  title: 'My Static Site Generator',
  description: 'A simple static site generator with configurable navigation',
  logo: '/navpress/images/logo.svg',
  github: 'https://github.com/aaronlamz/navpress',
  base:'/navpress/',
  meta: {
    title: 'My Custom Title',
    description: 'This is a description for SEO.',
    keywords: 'static site, generator, SEO',
    author: 'Author Name',
  },
  sidebar: [
    { 
      text: 'Home', 
      link: '/', 
      items: [
        {
          text: 'Group 1',
          link: '#group1',
          items: [
            { text: 'Child 1', link: 'https://example.com/child1' },
            { text: 'Child 2', link: 'https://example.com/child2' },
            { text: 'Child 2', link: 'https://example.com/child2' },
          ]
        },
        {
          text: 'Group 2',
          link: '#group2',
          items: [
            { text: 'Child 3', link: 'https://example.com/child3' },
            { text: 'Child 4', link: 'https://example.com/child4' },
            { text: 'Child 2', link: 'https://example.com/child2' },
          ]
        },
        {
          text: 'Group 3',
          link: '#group3',
          items: [
            { text: 'Child 3', link: 'https://example.com/child3' },
            { text: 'Child 4', link: 'https://example.com/child4' },
          ]
        },
        {
          text: 'Group 4',
          link: '#group4',
          items: [
            { text: 'Child 3', link: 'https://example.com/child3' },
            { text: 'Child 4', link: 'https://example.com/child4' },
          ]
        }
      ]
    },
    { 
      text: 'About', 
      link: '/about',
      expanded: false,
      items: [
        {
          text: 'Group A',
          link: '#groupA',
          items: [
            { text: 'Child A1', link: 'https://example.com/childA1' },
          ]
        }
      ]
    },
  ],
}
