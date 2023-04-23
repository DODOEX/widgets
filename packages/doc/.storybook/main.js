const { merge } = require('lodash');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    // "@storybook/addon-interactions",
    '@storybook/addon-docs',
    // https://storybook.js.org/addons/storybook-addon-designs/
    'storybook-addon-designs',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config) => {
    const svgLoaderRule = config.module.rules.find(
      (rule) => rule.test && rule.test.test && rule.test.test('.svg'),
    );
    svgLoaderRule.exclude = /svg$/;
    return merge(config, {
      resolve: {
        ...config.resolve,
        alias: {
          '@dodoex/components': path.resolve(
            __dirname,
            '../../dodoex-components',
            'src/',
          ),
          '@dodoex/widgets': path.resolve(
            __dirname,
            '../../dodoex-widgets',
            'src/',
          ),
          '@dodoex/icons': path.resolve(__dirname, '../../dodoex-icons'),
          '@dodoex/web3': path.resolve(__dirname, '../../dodoex-web3/src'),
          ...config.resolve.alias,
        },
        fallback: {
          ...(config.resolve || {}).fallback,
          // https://stackoverflow.com/questions/71158775/storybook-couldnt-resolve-fs
          fs: false,
          assert: false,
          // "buffer": require.resolve("buffer"),
          console: false,
          constants: false,
          crypto: false,
          domain: false,
          events: false,
          http: false,
          https: false,
          os: false,
          path: false,
          punycode: false,
          process: false,
          querystring: false,
          stream: require.resolve('stream-browserify'),
          string_decoder: false,
          sys: false,
          timers: false,
          tty: false,
          url: false,
          util: false,
          vm: false,
          zlib: false,
        },
      },
      module: {
        rules: [
          ...config.module.rules,
          {
            test: /\.svg$/,
            // type: 'asset/inline',
            oneOf: [
              {
                issuer: /\.s?css$/,
                type: 'asset/resource',
              },
              {
                use: [
                  {
                    loader: '@svgr/webpack',
                    options: {
                      svgoConfig: {
                        plugins: [
                          {
                            name: 'removeViewBox',
                            active: false,
                          },
                        ],
                      },
                    },
                  },
                  {
                    loader: 'file-loader',
                  },
                ],
                type: 'javascript/auto',
              },
            ],
          },
        ],
      },
      plugins: [
        ...config.plugins,
        // https://stackoverflow.com/questions/68707553/uncaught-referenceerror-buffer-is-not-defined
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ],
    });
  },
};
