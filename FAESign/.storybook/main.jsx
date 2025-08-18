/** @type { import('@storybook/react-vite').StorybookConfig } */
const path = require('path');

const config = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../tests/visual/backstop/test-pages/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  core: {
    disableTelemetry: true
  },
  viteFinal: async (config, { configType }) => {
    // Configurar esbuild para procesar JSX en archivos .js
    config.esbuild = {
      ...config.esbuild,
      loader: 'jsx',
      include: /\.(jsx?|tsx?)$/,
      exclude: []
    };

    // Configurar optimizeDeps para manejar JSX
    config.optimizeDeps = {
      ...config.optimizeDeps,
      esbuildOptions: {
        ...config.optimizeDeps?.esbuildOptions,
        loader: {
          '.js': 'jsx',
          '.jsx': 'jsx',
          '.ts': 'tsx',
          '.tsx': 'tsx'
        }
      }
    };

    // Deshabilitar Fast Refresh para pruebas visuales estables
    if (config.plugins) {
      config.plugins = config.plugins.filter(plugin => 
        plugin && plugin.name !== 'vite:react-refresh'
      );
    }
    
    // Deshabilitar HMR completamente
    if (configType === 'DEVELOPMENT') {
      config.server = {
        ...config.server,
        hmr: false,
        watch: {
          ignored: ['**/node_modules/**', '**/.git/**']
        }
      };
    }
    
    // Configurar aliases para consistencia
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': path.resolve(__dirname, '../src'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@pages': path.resolve(__dirname, '../src/pages'),
        '@utils': path.resolve(__dirname, '../src/utils'),
        '@shared': path.resolve(__dirname, '../src/shared')
      }
    };
    
    // Optimizar para pruebas visuales
    config.build = {
      ...config.build,
      minify: false,
      sourcemap: false
    };
    
    return config;
  },
  docs: {
    autodocs: 'tag'
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  }
};

export default config;