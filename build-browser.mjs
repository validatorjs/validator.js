/* eslint import/no-extraneous-dependencies: 0 */
import fs from 'fs';
import { rollup } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import babelPresetEnv from '@babel/preset-env';
import pkg from "./package.json" with { type: "json" };

// Bundle from a default-only entry so Rollup keeps emitting the classic
// single-export UMD wrapper (define(factory), module.exports = factory()),
// leaving the browser bundle's surface unchanged by the named exports that
// src/index.js adds for cjs-module-lexer.
const browserEntry = {
  name: 'browser-entry',
  resolveId: id => (id === 'browser-entry' ? id : null),
  load: id => (id === 'browser-entry'
    ? "import * as validator from './src/validator-main'; export default validator;"
    : null),
};

rollup({
  input: 'browser-entry',
  plugins: [
    browserEntry,
    babel({
      presets: [[babelPresetEnv, { 
        modules: false,
        targets: {
          node: '0.10',
          ie: '11'
        }
      }]],
      babelHelpers: 'bundled',
      babelrc: false,
    }),
  ],
})
  .then((bundle) =>
    bundle.write({
      file: 'validator.js',
      format: 'umd',
      name: pkg.name,
      banner: `/*!\n${String(fs.readFileSync('./LICENSE'))
        .trim()
        .split('\n')
        .map((l) => ` * ${l}`)
        .join('\n')}\n */`,
    })
  )
  .catch((e) => {
    process.stderr.write(`${e.message}\n`);
    process.exit(1);
  });
