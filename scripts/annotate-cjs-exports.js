/*
 * Post-build step for `npm run build:node`.
 *
 * Babel (with babel-plugin-add-module-exports) ends the CommonJS entry point
 * with `module.exports = exports.default;`, which Node.js cannot analyse
 * statically, so `import { isEmail } from 'validator'` fails in native ESM.
 *
 * This script appends a never-executed hint listing the export names, using
 * the pattern esbuild emits for the same purpose:
 *
 *   0 && (module.exports = { isEmail: isEmail, ... });
 *
 * Node.js' CommonJS export lexer (cjs-module-lexer / merve) detects the names
 * from this hint and reads their values from the real `module.exports` at
 * import time. Because the hint is dead code, runtime behaviour of the
 * CommonJS build is unchanged. The ES and browser builds are not touched.
 *
 * Usage: node scripts/annotate-cjs-exports.js [path/to/index.js]
 */

'use strict';

const fs = require('fs');
const path = require('path');

const MARKER = '// Annotate the CommonJS export names for ESM import in Node.js:';
const BABEL_TAIL = 'module.exports = exports.default;';
const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const RESERVED = [
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false',
  'finally', 'for', 'function', 'if', 'implements', 'import', 'in',
  'instanceof', 'interface', 'let', 'new', 'null', 'package', 'private',
  'protected', 'public', 'return', 'static', 'super', 'switch', 'this',
  'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
  'await',
];

function fail(message) {
  throw new Error(`annotate-cjs-exports: ${message}`);
}

function loadKeys(file) {
  delete require.cache[file];
  const exported = require(file); // eslint-disable-line global-require, import/no-dynamic-require
  if (!exported || typeof exported !== 'object') {
    fail(`${file} does not export an object`);
  }
  if (exported.default !== exported) {
    fail(`${file}: expected module.exports.default === module.exports`);
  }
  return Object.keys(exported);
}

function annotate(file) {
  let source = fs.readFileSync(file, 'utf8');

  // Idempotency: drop a hint left by a previous run before re-annotating.
  const markerIndex = source.indexOf(MARKER);
  if (markerIndex !== -1) {
    if (source.indexOf(MARKER, markerIndex + 1) !== -1) {
      fail(`${file} contains more than one export-name hint`);
    }
    source = source.slice(0, markerIndex);
  }

  if (source.indexOf(BABEL_TAIL) === -1) {
    fail(`${file} does not contain \`${BABEL_TAIL}\`; ` +
      'the Babel output changed shape, so revisit whether this hint is still needed');
  }

  const keys = loadKeys(file);
  // Node.js always maps `default` to module.exports, and `default` cannot be
  // used as an identifier value in the hint, so it is left out.
  const names = keys.filter(key => key !== 'default');
  if (names.length === 0) {
    fail(`${file} exports no names`);
  }
  names.forEach((name) => {
    if (!IDENTIFIER.test(name) || RESERVED.indexOf(name) !== -1) {
      fail(`export name ${JSON.stringify(name)} cannot be written as \`${name}: ${name}\``);
    }
  });

  const hint = `${MARKER}\n0 && (module.exports = {\n${
    names.map(name => `  ${name}: ${name}`).join(',\n')
  }\n});\n`;
  const separator = /\n$/.test(source) ? '' : '\n';
  fs.writeFileSync(file, source + separator + hint);

  // The hint is dead code: the module must still load with the same exports.
  const after = loadKeys(file);
  if (after.join(',') !== keys.join(',')) {
    fail(`${file} exports changed after annotation`);
  }
  return names.length;
}

const target = path.resolve(process.argv[2] || path.join(__dirname, '..', 'index.js'));
const count = annotate(target);
console.log(`annotate-cjs-exports: listed ${count} export names in ${target}`);
