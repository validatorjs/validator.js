/*
 * Post-build step for `npm run build:es`.
 *
 * Writes es/package.json so that Node.js (and tools that follow its rules,
 * such as webpack 5) load the files in es/ as ES modules, while the root
 * package, lib/ and index.js stay CommonJS:
 *
 *   type         "module": es/**\/*.js are ES modules.
 *   sideEffects  Copied from the root package.json. Bundlers read this flag
 *                from the nearest package.json, so without it the nested file
 *                would hide the root's `"sideEffects": false` from es/.
 *
 * No other fields are written: a `name` could collide with the real package
 * in tools that index package names, and `main`/`exports` are only honoured
 * at a package root.
 *
 * Usage: node scripts/write-es-package-json.js [path/to/es]
 */

'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const esDir = path.resolve(process.argv[2] || path.join(root, 'es'));

function fail(message) {
  throw new Error(`write-es-package-json: ${message}`);
}

if (!fs.existsSync(path.join(esDir, 'index.js'))) {
  fail(`${esDir}/index.js does not exist; run babel for the es build first`);
}

const rootPackage = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (rootPackage.type !== undefined && rootPackage.type !== 'commonjs') {
  fail(`the root package.json has "type": ${JSON.stringify(rootPackage.type)}; ` +
    'revisit whether es/package.json is still needed');
}

const esPackage = { type: 'module' };
if (typeof rootPackage.sideEffects === 'boolean') {
  esPackage.sideEffects = rootPackage.sideEffects;
} else if (rootPackage.sideEffects !== undefined) {
  // Glob patterns are relative to the package.json that holds them.
  fail('the root "sideEffects" is not a boolean; translate its patterns for es/ by hand');
}

const file = path.join(esDir, 'package.json');
fs.writeFileSync(file, `${JSON.stringify(esPackage, null, 2)}\n`);
console.log(`write-es-package-json: wrote ${file}`);
