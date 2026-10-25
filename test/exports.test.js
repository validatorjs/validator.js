import assert from 'assert';
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import url from 'url';
import validator from '../index';
import { locales as isPostalCodeLocales } from '../src/lib/isPostalCode';
import { locales as isAlphaLocales } from '../src/lib/isAlpha';
import { locales as isAlphanumericLocales } from '../src/lib/isAlphanumeric';
import { locales as isMobilePhoneLocales } from '../src/lib/isMobilePhone';
import { locales as isFloatLocales } from '../src/lib/isFloat';
import { locales as ibanCountryCodes } from '../src/lib/isIBAN';
import { locales as passportNumberLocales } from '../src/lib/isPassportNumber';

describe('Exports', () => {
  it('should export isPassportNumbers\'s supported locales', () => {
    assert.ok(passportNumberLocales instanceof Array);
    assert.ok(validator.passportNumberLocales instanceof Array);
  });

  it('should export validators', () => {
    assert.strictEqual(typeof validator.isEmail, 'function');
    assert.strictEqual(typeof validator.isAlpha, 'function');
  });

  it('should export sanitizers', () => {
    assert.strictEqual(typeof validator.toBoolean, 'function');
    assert.strictEqual(typeof validator.toFloat, 'function');
  });

  it('should export toString and not inherit Object.prototype.toString', () => {
    assert.notStrictEqual(validator.toString, Object.prototype.toString);
    assert.strictEqual(validator.toString('test'), 'test');
    assert.strictEqual(validator.toString(123), '123');
    assert.strictEqual(validator.toString(null), '');
    assert.strictEqual(validator.toString(undefined), '');
  });

  it('should export the version number', () => {
    /* eslint-disable global-require */
    assert.strictEqual(
      validator.version, require('../package.json').version,
      'Version number mismatch in "package.json" vs. "validator.js"'
    );
    /* eslint-enable global-require */
  });

  it('should export isPostalCode\'s supported locales', () => {
    assert.ok(isPostalCodeLocales instanceof Array);
    assert.ok(validator.isPostalCodeLocales instanceof Array);
  });

  it('should export isAlpha\'s supported locales', () => {
    assert.ok(isAlphaLocales instanceof Array);
    assert.ok(validator.isAlphaLocales instanceof Array);
  });

  it('should export isAlphanumeric\'s supported locales', () => {
    assert.ok(isAlphanumericLocales instanceof Array);
    assert.ok(validator.isAlphanumericLocales instanceof Array);
  });

  it('should export isMobilePhone\'s supported locales', () => {
    assert.ok(isMobilePhoneLocales instanceof Array);
    assert.ok(validator.isMobilePhoneLocales instanceof Array);
  });

  it('should export isFloat\'s supported locales', () => {
    assert.ok(isFloatLocales instanceof Array);
    assert.ok(validator.isFloatLocales instanceof Array);
  });

  it('should export a list of country codes that implement IBAN', () => {
    assert.ok(ibanCountryCodes instanceof Array);
    assert.ok(validator.ibanLocales instanceof Array);
  });
});

// Node.js detects the named exports of a CommonJS module statically
// (cjs-module-lexer) since v12.20.0 and v14.13.0.
function supportsCjsNamedExports() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  return major > 14 || (major === 14 && minor >= 13) || (major === 12 && minor >= 20);
}

describe('CommonJS entry point', () => {
  /* eslint-disable global-require */
  it('should keep its exports as plain writable data properties', () => {
    const cjs = require('../index');
    assert.strictEqual(cjs.default, cjs);
    assert.strictEqual(Object.getPrototypeOf(cjs), Object.prototype);
    assert.ok(Object.isExtensible(cjs));
    Object.keys(cjs).forEach((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(cjs, key);
      assert.ok(
        'value' in descriptor && descriptor.writable && descriptor.configurable,
        `${key} is not a writable, configurable data property`
      );
    });

    const original = cjs.isEmail;
    const stub = () => true;
    try {
      cjs.isEmail = stub;
      assert.strictEqual(require('../index').isEmail, stub);
    } finally {
      cjs.isEmail = original;
    }
    assert.strictEqual(require('../index').isEmail, original);
  });
  /* eslint-enable global-require */

  it('should provide every export as a named export to native ES modules', function () {
    if (!supportsCjsNamedExports()) {
      this.skip();
      return;
    }
    this.timeout(30000);

    const indexUrl = url.pathToFileURL(path.resolve(__dirname, '../index.js')).href;
    const keys = Object.keys(validator);
    const specifiers = keys.map((key, i) => `${key} as e${i}`).join(', ');
    const source = [
      `import { ${specifiers} } from ${JSON.stringify(indexUrl)};`,
      'import { createRequire } from "module";',
      `const cjs = createRequire(${JSON.stringify(indexUrl)})("./index.js");`,
      `const imported = [${keys.map((key, i) => `e${i}`).join(', ')}];`,
      `const keys = ${JSON.stringify(keys)};`,
      'const mismatched = keys.filter((key, i) => imported[i] !== cjs[key]);',
      'console.log(JSON.stringify({ mismatched, isDefault: cjs.default === cjs }));',
    ].join('\n');

    // Run the source from an .mjs file rather than with `--input-type=module -e`,
    // which Deno's Node.js compatibility layer evaluates as a script.
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'validator-'));
    const file = path.join(dir, 'named-exports.mjs');
    fs.writeFileSync(file, source);
    let result;
    try {
      result = spawnSync(process.execPath, [file], { encoding: 'utf8' });
    } finally {
      fs.unlinkSync(file);
      fs.rmdirSync(dir);
    }
    if (result.error) throw result.error;
    assert.strictEqual(result.status, 0, `ESM import failed:\n${result.stderr}`);
    const output = JSON.parse(result.stdout.trim().split('\n').pop());
    assert.deepStrictEqual(output, { mismatched: [], isDefault: true });
  });
});
