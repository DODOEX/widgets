import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svgr from '@svgr/rollup';
import pkg from './package.json' with { type: 'json' };
import globby from 'globby';
import css from 'rollup-plugin-import-css';
import clear from 'rollup-plugin-clear';

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
    clear({
      // required, point out which directories should be clear.
      targets: ['dist'],
      // optional, whether clear the directores when rollup recompile on --watch mode.
      watch: true, // default: false
    }),
  ],
  external: (id) => {
    const externals = [
      ...Object.keys(pkg.dependencies || {}).filter(
        (key) => !['@dodoex/icons'].includes(key),
      ),
      ...Object.keys(pkg.peerDependencies || {}),
      'scheduler',
      'react-is',
      'react-reconciler',
      'konva',
      'react-konva',
    ];

    return externals.some(
      (pkgName) => id === pkgName || id.startsWith(`${pkgName}/`),
    );
  },
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
        dir: 'dist',
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
