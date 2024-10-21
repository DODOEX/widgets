import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svgr from '@svgr/rollup';
import pkg from './package.json' with { type: 'json' };
import globby from 'globby';
import css from "rollup-plugin-import-css";

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const baseConfig = {
  input: pkg.source,
  plugins: [
    replace({
      '../locales/${locale}.js': './locales/${locale}.js',
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
    css(),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}).filter(
      (key) => !['@dodoex/icons'].includes(key),
    ),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
};

const localesConfig = globby.sync('src/locales/*.js').map((inputFile) => ({
  input: inputFile,
  output: [
    {
      dir: 'dist/locales',
      format: 'esm',
      sourcemap: false,
    },
    {
      dir: 'dist/cjs/locales',
      sourcemap: false,
    },
  ],
}));

export default [
  {
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
  ...localesConfig,
];
