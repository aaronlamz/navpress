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
      children: [
        {
          group: 'Group 1',
          items: [
            { text: 'Child 1', link: 'https://example.com/child1' },
            { text: 'Child 2', link: 'https://example.com/child2' },
          ]
        },
        {
          group: 'Group 2',
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
      children: [
        {
          group: 'Group A',
          items: [
            { text: 'Child A1', link: 'https://example.com/childA1' },
          ]
        }
      ]
    },
  ],
}
