import path from 'path';
import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel';
import license from 'rollup-plugin-license';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const input = 'src/index.js';
const esInput = 'src/index.es.js';
export default [
  // commonjs (Node)
  {
    input,
    output: {
      format: 'cjs',
      dir: '.',
      name: pkg.name,
      preserveModules: true,
      exports: 'named',
      plugins: [getBabelOutputPlugin({
        plugins: [
          ['add-module-exports', {
            addDefaultProperty: true,
          }],
        ],
      })],
    },
    plugins: [
      babel({
        babelrc: false,
        babelHelpers: 'inline',
        presets: [
          ['@babel/preset-env', {
            targets: { node: '0.10' },
          }],
        ],
      }),
    ],
  },
  // UMD Development (Node + Browsers)
  {
    input,
    plugins: [
      babel({
        babelrc: false,
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            targets: { node: '0.10' },
          }],
        ],
      }),
      license({
        banner: {
          commentStyle: 'ignored',
          content: {
            file: path.join(__dirname, 'LICENSE'),
            encoding: 'utf-8',
          },
        },
      }),
    ],
    output: {
      format: 'umd',
      file: pkg.browser,
      name: pkg.name,
    },
  },
  // UMD production (Node + Browsers)
  {
    input,
    plugins: [
      babel({
        babelrc: false,
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            targets: { node: '0.10' },
          }],
        ],
      }),
      license({
        banner: {
          commentStyle: 'ignored',
          content: {
            file: path.join(__dirname, 'LICENSE'),
            encoding: 'utf-8',
          },
        },
      }),
      terser(),
    ],
    output: {
      format: 'umd',
      file: pkg.browser.replace('.js', '.min.js'),
      name: pkg.name,
    },
  },
  // ES6
  {
    input: esInput,
    plugins: [
      babel({
        babelrc: false,
        babelHelpers: 'inline',
        presets: [
          ['@babel/preset-modules', {
            loose: true,
          }],
        ],
      }),
    ],
    output: {
      format: 'es',
      dir: 'es',
      name: pkg.name,
      preserveModules: true,
      esModule: true,
    },
  },
  // ES6 mjs (Modern Browsers)
  {
    input: esInput,
    plugins: [
      babel({
        babelrc: false,
        babelHelpers: 'inline',
        presets: [
          ['@babel/preset-modules', {
            loose: true,
          }],
        ],
      }),
      terser({ ecma: 8, safari10: true }),
    ],
    output: {
      format: 'es',
      dir: 'es',
      name: pkg.name,
      preserveModules: true,
      esModule: true,
      entryFileNames: '[name].mjs',
    },
  },
];
