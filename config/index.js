// config/index.js
export default {
  title: 'My Static Site Generator',
  description: 'A simple static site generator with configurable navigation',
  nav: [
    { text: 'Home', link: '/home' },
    { text: 'About', link: '/about' },
  ],
  sidebar: [
    { 
      text: 'Home', 
      link: '/home', 
      items: [
        {
          text: 'Group 1',
          link: '#group1',
          items: [
            { text: 'Child 1', link: 'https://example.com/child1' },
            { text: 'Child 2', link: 'https://example.com/child2' },
          ]
        },
        {
          text: 'Group 2',
          link: '#group2',
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
