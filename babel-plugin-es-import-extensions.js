/*
 * Babel plugin used by the ES module build (`npm run build:es`, see `.babelrc`).
 *
 * Node.js requires relative import paths in ES modules to include the file
 * extension, so `import assertString from './util/assertString'` is rewritten
 * to `import assertString from './util/assertString.js'`.
 */
const fs = require('fs');
const path = require('path');

function isFile(file) {
  try {
    return fs.statSync(file).isFile();
  } catch (err) {
    return false;
  }
}

module.exports = function esImportExtensions() {
  function addExtension(nodePath, state) {
    const { source } = nodePath.node;
    if (!source || !/^\.\.?\//.test(source.value)) return;
    const file = path.resolve(path.dirname(state.filename), source.value);
    if (isFile(file)) return;
    if (!isFile(`${file}.js`)) {
      throw nodePath.buildCodeFrameError(`Cannot resolve "${source.value}" to a file`);
    }
    source.value = `${source.value}.js`;
  }

  return {
    visitor: {
      ImportDeclaration: addExtension,
      ExportNamedDeclaration: addExtension,
      ExportAllDeclaration: addExtension,
    },
  };
};
