import { babel } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dynamicImportVariables from 'rollup-plugin-dynamic-import-variables';
import clear from 'rollup-plugin-clear';
import pkg from './package.json' with { type: 'json' };

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
    json(),
    typescript(),
    commonjs({
      sourceMap: false,
    }),
    dynamicImportVariables(),
    babel({
      extensions,
      babelHelpers: 'bundled',
    }),
    clear({
      // required, point out which directories should be clear.
      targets: ['dist'],
      // optional, whether clear the directores when rollup recompile on --watch mode.
      watch: true, // default: false
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
        dir: 'dist',
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
