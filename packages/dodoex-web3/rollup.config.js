import { babel } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import url from 'rollup-plugin-url';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const extensions = ['.js', '.ts', '.jsx', '.tsx'];

const config = {
  plugins: [
    url(),
    json(),
    typescript(),
    commonjs({
      sourceMap: false,
    }),
    babel({
      extensions,
      babelHelpers: 'bundled',
    }),
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
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
    ...config,
  },
];
