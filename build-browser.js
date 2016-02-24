const pkg = require('./package.json');
const fs = require('fs');
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');

rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      presets: ['es2015-rollup'],
      babelrc: false,
    }),
  ],
}).then(bundle => (
  bundle.write({
    dest: 'validator.js',
    format: 'umd',
    moduleName: pkg.name,
    banner: (
      '/*!\n' +
      String(fs.readFileSync('./LICENSE')).trim().split('\n').map(l => ` * ${l}`).join('\n') +
      '\n */'
    ),
  })
)).catch(e => {
  process.stderr.write(e.message + '\n');
  process.exit(1);
});
