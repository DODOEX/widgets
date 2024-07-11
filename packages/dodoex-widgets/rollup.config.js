import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { default as multi } from 'rollup-plugin-multi-input';
import url from 'rollup-plugin-url';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svgr from '@svgr/rollup';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const baseConfig = {
  input: pkg.source,
  plugins: [
    replace({
      '../../locales/${locale}.js': './locales/${locale}.js',
      delimiters: ['', ''],
    }),
    url(),
    svgr({
      svgo: true,
      svgoConfig: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
        ],
      },
    }),
    json(),
    typescript(),
    commonjs(),
    resolve(),
    babel({
      extensions,
      babelHelpers: 'bundled',
    }),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}).filter(
      (key) => !['@dodoex/components'].includes(key),
    ),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
};

export default [
  {
    input: pkg.source,
    output: [
      {
        dir: 'dist',
        format: 'es',
        plugins: [terser()],
      },
      {
        dir: 'dist/cjs',
        entryFileNames: '[name].cjs',
        chunkFileNames: '[name]-[hash].cjs',
        format: 'cjs',
        sourcemap: false,
        plugins: [terser()],
      },
    ],
    ...baseConfig,
  },
  {
    input: 'src/locales/*.js',
    output: [
      {
        dir: 'dist',
        format: 'esm',
        sourcemap: false,
      },
      {
        dir: 'dist/cjs',
        sourcemap: false,
      },
    ],
    plugins: [commonjs(), multi()],
  },
];
