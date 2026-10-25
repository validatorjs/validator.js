// Native ES module consumer of the installed package. Run by
// scripts/check-package.mjs from a project that installed the packed tarball
// (not by Mocha).
import assert from 'node:assert';
import { createRequire } from 'node:module';
import validator, { isEmail, isMobilePhoneLocales, version } from 'validator';
import esValidator from 'validator/es/index.js';
import esIsEmail from 'validator/es/lib/isEmail.js';
import esIsMobilePhone, { locales } from 'validator/es/lib/isMobilePhone.js';

const pkg = createRequire(import.meta.url)('validator/package.json');

// Root entry (CommonJS): default and named imports.
assert.strictEqual(version, pkg.version);
assert.strictEqual(validator.version, pkg.version);
assert.strictEqual(isEmail, validator.isEmail);
assert.strictEqual(isMobilePhoneLocales, validator.isMobilePhoneLocales);
assert.strictEqual(isEmail('foo@bar.com'), true);
assert.strictEqual(isEmail('foo'), false);

// Deep ES module imports.
assert.strictEqual(typeof esIsEmail, 'function');
assert.strictEqual(esIsEmail('foo@bar.com'), true);
assert.strictEqual(esIsEmail('foo'), false);
assert.strictEqual(esIsMobilePhone('+14155552671', 'en-US'), true);
assert.ok(locales.indexOf('en-US') !== -1);
assert.deepStrictEqual(locales, validator.isMobilePhoneLocales);

// The ES module index exposes the same API as the CommonJS entry.
assert.strictEqual(esValidator.version, pkg.version);
assert.deepStrictEqual(
  Object.keys(esValidator).sort(),
  Object.keys(validator).filter(key => key !== 'default').sort()
);
assert.strictEqual(esValidator.isEmail, esIsEmail);
assert.strictEqual(esValidator.isIBAN('DE89370400440532013000'), true);

console.log(`esm ok (validator ${pkg.version})`);
