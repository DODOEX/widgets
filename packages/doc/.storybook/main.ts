import type { StorybookConfig } from '@storybook/react-webpack5';
import { merge } from 'lodash';

import path, { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-webpack5-compiler-babel'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {},
  },

  docs: {
    autodocs: false,
  },

  webpackFinal: async (config) => {
    const svgLoaderRule = (config.module?.rules ?? []).find(
      // @ts-ignore
      (rule) => rule.test && rule.test.test && rule.test.test('.svg'),
    );
    if (svgLoaderRule) {
      // @ts-ignore
      svgLoaderRule.exclude = /svg$/;
    }
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
          '@dodoex/api': path.resolve(__dirname, '../../dodoex-api', 'src/'),
          ...config.resolve?.alias,
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
          ...(config.module?.rules ?? []),
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
    });
  },
};
export default config;
