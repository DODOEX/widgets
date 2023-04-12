import { babel } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const extensions = ['.js', '.ts', '.jsx', '.tsx'];

const config = {
  plugins: [
    nodeResolve({
      modulesOnly: true,
      // browser: true,
      preferBuiltins: false,
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectories: ['node_modules'],
      },
    }),
    url(),
    svgr({
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
