const babel = require('babel-core');
const glob = require('glob');
const fs = require('fs');
const _ = require('async');

const babelrc = {
  presets: ['es2015'],
  plugins: ['add-module-exports'],
  resolveModuleSource(source) {
    return source
      .replace('./util', './lib/util')
      .replace('../util', './util');
  },
};

glob('{index,*/**}.js', { cwd: 'src' }, (globErr, files) => {
  _.each(files, (file, done) => {
    _.waterfall([
      (transformDone) => {
        babel.transformFile(`src/${file}`, babelrc, transformDone);
      },
      (result, writeDone) => {
        const dest = file.replace(/^util/, 'lib/util');
        fs.writeFile(dest, result.code, writeDone);
      },
    ], done);
  }, (err) => {
    if (err) return console.error('Error writing lib files:', err);
    console.info('lib files written');
  });
});
