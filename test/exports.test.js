/* eslint-disable import/no-extraneous-dependencies */
import assert from 'assert';
import { createRequire } from 'module';
import { describe, it } from 'vitest';
import validator from '../src/index.js';
import { locales as isPostalCodeLocales } from '../src/lib/isPostalCode.js';
import { locales as isAlphaLocales } from '../src/lib/isAlpha.js';
import { locales as isAlphanumericLocales } from '../src/lib/isAlphanumeric.js';
import { locales as isMobilePhoneLocales } from '../src/lib/isMobilePhone.js';
import { locales as isFloatLocales } from '../src/lib/isFloat.js';
import { locales as ibanCountryCodes } from '../src/lib/isIBAN.js';

const require = createRequire(import.meta.url);

describe('Exports', () => {
  it('should export validators', () => {
    assert.strictEqual(typeof validator.isEmail, 'function');
    assert.strictEqual(typeof validator.isAlpha, 'function');
  });

  it('should export sanitizers', () => {
    assert.strictEqual(typeof validator.toBoolean, 'function');
    assert.strictEqual(typeof validator.toFloat, 'function');
  });

  it('should export the version number', () => {
    /* eslint-disable global-require */
    assert.strictEqual(
      validator.version,
      require('../package.json').version,
      'Version number mismatch in "package.json" vs. "validator.js"',
    );
    /* eslint-enable global-require */
  });

  it("should export isPostalCode's supported locales", () => {
    assert.ok(isPostalCodeLocales instanceof Array);
    assert.ok(validator.isPostalCodeLocales instanceof Array);
  });

  it("should export isAlpha's supported locales", () => {
    assert.ok(isAlphaLocales instanceof Array);
    assert.ok(validator.isAlphaLocales instanceof Array);
  });

  it("should export isAlphanumeric's supported locales", () => {
    assert.ok(isAlphanumericLocales instanceof Array);
    assert.ok(validator.isAlphanumericLocales instanceof Array);
  });

  it("should export isMobilePhone's supported locales", () => {
    assert.ok(isMobilePhoneLocales instanceof Array);
    assert.ok(validator.isMobilePhoneLocales instanceof Array);
  });

  it("should export isFloat's supported locales", () => {
    assert.ok(isFloatLocales instanceof Array);
    assert.ok(validator.isFloatLocales instanceof Array);
  });

  it('should export a list of country codes that implement IBAN', () => {
    assert.ok(ibanCountryCodes instanceof Array);
    assert.ok(validator.ibanLocales instanceof Array);
  });
});
