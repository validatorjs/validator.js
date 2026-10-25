import assert from 'assert';
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import url from 'url';
import { parseSync, traverse } from '@babel/core';

const root = path.resolve(__dirname, '..');
const esRoot = path.join(root, 'es');

function listJsFiles(dir) {
  return fs.readdirSync(dir).reduce((files, name) => {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) return files.concat(listJsFiles(file));
    return /\.js$/.test(name) ? files.concat(file) : files;
  }, []);
}

function moduleSpecifiers(file) {
  const ast = parseSync(fs.readFileSync(file, 'utf8'), {
    filename: file,
    sourceType: 'module',
    babelrc: false,
    configFile: false,
  });
  const specifiers = [];
  const addSource = (nodePath) => {
    if (nodePath.node.source) specifiers.push(nodePath.node.source.value);
  };
  traverse(ast, {
    ImportDeclaration: addSource,
    ExportNamedDeclaration: addSource,
    ExportAllDeclaration: addSource,
    CallExpression(nodePath) {
      if (nodePath.get('callee').isImport()) {
        const argument = nodePath.node.arguments[0];
        specifiers.push(argument && argument.type === 'StringLiteral' ? argument.value : null);
      }
    },
  });
  return specifiers;
}

function runNode(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
  if (result.error) throw result.error;
  assert.strictEqual(result.status, 0, `node ${args[0]} failed:\n${result.stderr}`);
  return JSON.parse(result.stdout.trim().split('\n').pop());
}

// Run ES module source from an .mjs file rather than with
// `--input-type=module -e`, which Deno's Node.js compatibility layer
// evaluates as a script.
function runModule(source) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'validator-'));
  const file = path.join(dir, 'es-build.mjs');
  fs.writeFileSync(file, source);
  try {
    return runNode([file]);
  } finally {
    fs.unlinkSync(file);
    fs.rmdirSync(dir);
  }
}

// ES modules load from .js files in a "type": "module" scope without a flag
// since Node.js 12.17.0 and 13.2.0.
function supportsNativeEsm() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  return major > 13 || (major === 13 && minor >= 2) || (major === 12 && minor >= 17);
}

describe('ES module build (es/)', () => {
  it('should be marked as ES modules without hiding the root sideEffects flag', () => {
    const esPackage = JSON.parse(fs.readFileSync(path.join(esRoot, 'package.json'), 'utf8'));
    // eslint-disable-next-line global-require
    const rootPackage = require('../package.json');
    assert.deepStrictEqual(esPackage, { type: 'module', sideEffects: rootPackage.sideEffects });
  });

  it('should only use relative import specifiers with an extension that resolve to a file', function () {
    this.timeout(30000);
    const files = listJsFiles(esRoot);
    assert.ok(files.length > 100, `expected the full es/ tree, found ${files.length} files`);

    const problems = [];
    let checked = 0;
    files.forEach((file) => {
      moduleSpecifiers(file).forEach((specifier) => {
        checked += 1;
        const where = `${path.relative(root, file)}: ${JSON.stringify(specifier)}`;
        if (typeof specifier !== 'string' || !/^\.\.?\//.test(specifier)) {
          problems.push(`${where} is not a relative specifier`);
        } else if (!/\.js$/.test(specifier)) {
          problems.push(`${where} has no .js extension`);
        } else {
          const target = path.resolve(path.dirname(file), specifier);
          if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
            problems.push(`${where} does not resolve to a file`);
          }
        }
      });
    });
    assert.ok(checked > 200, `expected the es/ imports to be found, found ${checked}`);
    assert.deepStrictEqual(problems, []);
  });

  it('should load in native Node.js ESM and behave like the CommonJS build', function () {
    if (!supportsNativeEsm()) {
      this.skip();
      return;
    }
    this.timeout(30000);

    const href = file => JSON.stringify(url.pathToFileURL(path.join(root, file)).href);
    const source = `
      import validator from ${href('es/index.js')};
      import isEmail from ${href('es/lib/isEmail.js')};
      import isMobilePhone, { locales as mobileLocales } from ${href('es/lib/isMobilePhone.js')};
      import isAlpha, { locales as alphaLocales } from ${href('es/lib/isAlpha.js')};
      import { createRequire } from 'module';

      const require = createRequire(${href('index.js')});
      const cjs = require('./index.js');
      const cjsMobilePhone = require('./lib/isMobilePhone.js');

      const keys = Object.keys(cjs).filter(key => key !== 'default');
      const samples = [
        ['isEmail', 'foo@bar.com'], ['isEmail', 'foo'],
        ['isMobilePhone', '+14155552671', 'en-US'], ['isMobilePhone', '123', 'any'],
        ['isAlpha', 'abc'], ['isAlpha', 'абв', 'ru-RU'], ['isAlpha', 'abc', 'ru-RU'],
        ['isIBAN', 'DE89370400440532013000'], ['isPostalCode', '10001', 'US'],
        ['isUUID', 'A987FBC9-4BED-4078-8F07-9141BA07C9F3'], ['toBoolean', '1'],
      ];

      console.log(JSON.stringify({
        sameKeys: JSON.stringify(Object.keys(validator).sort()) === JSON.stringify(keys.sort()),
        differentValues: keys.filter(key => (typeof cjs[key] === 'function'
          ? typeof validator[key] !== 'function'
          : JSON.stringify(validator[key]) !== JSON.stringify(cjs[key]))),
        deepImportsAreIndexExports: validator.isEmail === isEmail &&
          validator.isMobilePhone === isMobilePhone && validator.isAlpha === isAlpha &&
          validator.isAlphaLocales === alphaLocales,
        mobileLocales: JSON.stringify(mobileLocales) === JSON.stringify(cjsMobilePhone.locales),
        deepResults: [isEmail('foo@bar.com'), isMobilePhone('+14155552671', 'en-US'), isAlpha('abc')],
        esm: samples.map(([name, ...args]) => validator[name](...args)),
        cjs: samples.map(([name, ...args]) => cjs[name](...args)),
      }));
    `;
    const output = runModule(source);
    assert.deepStrictEqual(output.cjs, [
      true, false, true, false, true, true, false, true, true, true, true,
    ]);
    assert.deepStrictEqual(output, {
      sameKeys: true,
      differentValues: [],
      deepImportsAreIndexExports: true,
      mobileLocales: true,
      deepResults: [true, true, true],
      esm: output.cjs,
      cjs: output.cjs,
    });
  });

  it('should be loadable with require() where Node.js supports require(esm)', function () {
    if (!process.features || !process.features.require_module) {
      this.skip();
      return;
    }
    this.timeout(30000);

    const output = runNode(['-e', `
      const isEmail = require(${JSON.stringify(path.join(esRoot, 'lib', 'isEmail.js'))});
      const isMobilePhone = require(${JSON.stringify(path.join(esRoot, 'lib', 'isMobilePhone.js'))});
      console.log(JSON.stringify([
        isEmail.default('foo@bar.com'),
        isMobilePhone.default('+14155552671', 'en-US'),
        Array.isArray(isMobilePhone.locales),
      ]));
    `]);
    assert.deepStrictEqual(output, [true, true, true]);
  });
});
