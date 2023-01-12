/* eslint import/no-extraneous-dependencies: 0 */
import fs from 'fs';
import { rollup } from 'rollup';
import babel from '@rollup/plugin-babel';
import babelPresetEnv from '@babel/preset-env';

rollup({
  input: 'src/index.js',
  plugins: [
    babel({
      presets: [[babelPresetEnv, { modules: false }]],
      babelrc: false,
    }),
  ],
})
  .then((bundle) => bundle.write({
    file: 'validator.js',
    format: 'umd',
    name: 'validator',
    banner: `/*!\n${String(fs.readFileSync('./LICENSE'))
      .trim()
      .split('\n')
      .map((l) => ` * ${l}`)
      .join('\n')}\n */`,
  }))
  .catch((e) => {
    process.stderr.write(`${e.message}\n`);
    process.exit(1);
  });
