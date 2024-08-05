# NavPress

NavPress is a simple and fast static navigation site generator. It allows you to easily create a navigation website using a configuration file.

## Features

- **Easy Configuration**: Configure your navigation and sidebar using a single file.
- **Dark Mode**: Built-in support for light and dark themes.

## Installation

To use NavPress in your project, you can install it via npm.

### Install via npm

1. **Navigate to your project directory**:

   ```bash
   cd your-project-directory
   ```

2. **Install NavPress**:

   ```bash
   npm install navpress --save-dev
   ```

## Usage

NavPress uses a configuration file `navpress.config.js` to generate the site. This configuration file should be placed in the root directory of your project.

### Example `navpress.config.js`

```javascript
export default {
  title: 'My Navigation Site',
  description: 'A simple and customizable navigation site generator.',
  nav: [
    { text: 'Home', link: '/home' },
    { text: 'About', link: '/about' }
  ],
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
            { text: 'Child 2', link: 'https://example.com/child2' }
          ]
        },
        {
          text: 'Group 2',
          link: '#group2',
          items: [
            { text: 'Child 3', link: 'https://example.com/child3' },
            { text: 'Child 4', link: 'https://example.com/child4' }
          ]
        }
      ]
    },
    { text: 'About', link: '/about' }
  ]
};
```

### Development

To start a development server with hot-reloading, use the following command:

```bash
npx navpress dev
```

This will start a development server at [http://localhost:3000](http://localhost:3000). You can view the site and make changes to your configuration and source files. The server will automatically reload to reflect your changes.

### Build

To build the site for production, run:

```bash
npx navpress build
```

This command will generate static files in the `dist` directory, ready for deployment. The output directory can be customized using the `--output` flag.

### Custom Configuration File

If you want to use a custom configuration file path, you can specify it using the `--config` option with both `dev` and `build` commands.

**Example:**

```bash
npx navpress dev --config ./path/to/custom.config.js
npx navpress build --config ./path/to/custom.config.js --output ./custom-output
```

## Deployment

After building the site, you can deploy the contents of the `dist` directory to any static hosting service, such as GitHub Pages, Netlify, or Vercel.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.

