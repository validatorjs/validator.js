/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import babel from '@rollup/plugin-babel';
import babelPresetEnv from '@babel/preset-env';
import terser from '@rollup/plugin-terser';

const license = `/*!\n${String(fs.readFileSync('./LICENSE'))
  .trim()
  .split('\n')
  .map((l) => (l ? ` * ${l}` : ' *'))
  .join('\n')}\n */`;

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.js',
  output: [
    {
      file: 'validator.js',
      format: 'umd',
      name: 'validator',
      banner: license,
    },
    {
      file: 'validator.min.js',
      format: 'umd',
      name: 'validator',
      plugins: [terser()],
      banner: license,
    },
  ],
  plugins: [
    babel({
      presets: [[babelPresetEnv, { modules: false }]],
      babelrc: false,
    }),
  ],
};

export default config;
