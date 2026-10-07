import assert from 'assert';
import fs from 'fs';
import path from 'path';
import validator from '../index';
import { locales as isPostalCodeLocales } from '../src/lib/isPostalCode';
import { locales as isAlphaLocales } from '../src/lib/isAlpha';
import { locales as isAlphanumericLocales } from '../src/lib/isAlphanumeric';
import { locales as isMobilePhoneLocales } from '../src/lib/isMobilePhone';
import { locales as isFloatLocales } from '../src/lib/isFloat';
import { locales as ibanCountryCodes } from '../src/lib/isIBAN';
import { locales as passportNumberLocales } from '../src/lib/isPassportNumber';

let parse = null;
try {
  // eslint-disable-next-line global-require
  ({ parse } = require('cjs-module-lexer'));
} catch (e) {
  // cjs-module-lexer uses the optional catch binding (ES2019), which
  // Node 8 cannot parse, so requiring it throws a SyntaxError there.
}

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

  (parse ? it : it.skip)('should be statically analyzable by cjs-module-lexer', () => {
    const detectable = new Set();
    const visit = (file) => {
      const { exports, reexports } = parse(fs.readFileSync(file, 'utf8'), file);
      exports.forEach(name => detectable.add(name));
      reexports.forEach(specifier => visit(path.join(path.dirname(file), `${specifier}.js`)));
    };
    visit(path.join(__dirname, '..', 'index.js'));
    Object.keys(validator).forEach((name) => {
      assert.ok(detectable.has(name), `cjs-module-lexer cannot detect export "${name}"`);
    });
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
