/*
 * Babel plugin for the `es` build (`npm run build:es`).
 *
 * Node.js ESM, Deno, browsers without a bundler, and JSR only accept fully
 * specified relative imports, so `import x from './util/assertString'` must
 * become `import x from './util/assertString.js'` in es/. Sources in src/ keep
 * their extensionless specifiers, which the CommonJS and browser builds use
 * unchanged.
 *
 * Each relative specifier is resolved against the source file the way
 * Node.js' require() would resolve it (`<path>.js`, then `<path>/index.js`),
 * so es/ and lib/ load the same modules. The build fails on anything this
 * plugin cannot rewrite safely: bare (package) specifiers, computed dynamic
 * imports, and specifiers that do not resolve to a .js file.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const RELATIVE = /^\.\.?(\/|$)/;

function isFile(file) {
  try {
    return fs.statSync(file).isFile();
  } catch (e) {
    return false;
  }
}

module.exports = function fullySpecified(api) {
  api.assertVersion(7);

  function rewrite(source, state) {
    const specifier = source.node.value;
    const from = state.filename;
    if (!from) {
      throw source.buildCodeFrameError('fully-specified: the source file name is unknown');
    }
    if (!RELATIVE.test(specifier)) {
      throw source.buildCodeFrameError(`fully-specified: unexpected non-relative import ${JSON.stringify(specifier)}; ` +
        'validator has no runtime dependencies, and es/ cannot resolve packages');
    }

    const dir = path.dirname(from);
    let resolved;
    if (/\.js$/.test(specifier) && isFile(path.resolve(dir, specifier))) {
      resolved = specifier;
    } else if (!/\/$/.test(specifier) && isFile(path.resolve(dir, `${specifier}.js`))) {
      resolved = `${specifier}.js`;
    } else if (isFile(path.resolve(dir, specifier, 'index.js'))) {
      resolved = `${specifier.replace(/\/$/, '')}/index.js`;
    } else {
      throw source.buildCodeFrameError(`fully-specified: cannot resolve ${JSON.stringify(specifier)} ` +
        `from ${from} to a .js file`);
    }

    if (resolved !== specifier) {
      const literal = api.types.stringLiteral(resolved);
      // Keep the original quote style so es/ differs only in the specifier.
      const raw = source.node.extra && source.node.extra.raw;
      if (raw) {
        literal.extra = { rawValue: resolved, raw: `${raw[0]}${resolved}${raw[0]}` };
      }
      source.replaceWith(literal);
    }
  }

  function declaration(nodePath, state) {
    if (nodePath.node.source) {
      rewrite(nodePath.get('source'), state);
    }
  }

  return {
    name: 'fully-specified',
    visitor: {
      ImportDeclaration: declaration,
      ExportNamedDeclaration: declaration,
      ExportAllDeclaration: declaration,
      CallExpression(nodePath, state) {
        if (!nodePath.get('callee').isImport()) return;
        const argument = nodePath.get('arguments')[0];
        if (!argument || !argument.isStringLiteral()) {
          throw nodePath.buildCodeFrameError('fully-specified: dynamic import() needs a string literal specifier');
        }
        rewrite(argument, state);
      },
      // Dynamic import() as parsed with `createImportExpressions` (Babel 8).
      ImportExpression(nodePath, state) {
        const argument = nodePath.get('source');
        if (!argument.isStringLiteral()) {
          throw nodePath.buildCodeFrameError('fully-specified: dynamic import() needs a string literal specifier');
        }
        rewrite(argument, state);
      },
    },
  };
};
