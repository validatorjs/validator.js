// CommonJS consumer of the installed package. Run by scripts/check-package.mjs
// from a project that installed the packed tarball (not by Mocha).

'use strict';

const assert = require('node:assert');
const validator = require('validator');
const isEmail = require('validator/lib/isEmail');
const isMobilePhone = require('validator/lib/isMobilePhone');
const browserBuild = require('validator/validator.min.js');
const { version } = require('validator/package.json');

assert.strictEqual(validator.version, version);
assert.strictEqual(validator.default, validator);
assert.strictEqual(validator.isEmail('foo@bar.com'), true);
assert.strictEqual(validator.isEmail('foo'), false);

assert.strictEqual(isEmail, validator.isEmail);
assert.strictEqual(isEmail.default, isEmail);
assert.strictEqual(isEmail('foo@bar.com'), true);

// Modules with named exports keep the Babel shape: { default, locales }.
assert.strictEqual(isMobilePhone.default, validator.isMobilePhone);
assert.deepStrictEqual(isMobilePhone.locales, validator.isMobilePhoneLocales);
assert.strictEqual(isMobilePhone.default('+14155552671', 'en-US'), true);

// The minified UMD build (the unpkg CDN file in the README).
assert.strictEqual(browserBuild.version, version);
assert.strictEqual(browserBuild.isEmail('foo@bar.com'), true);
assert.strictEqual(browserBuild.isIBAN('DE89370400440532013000'), true);

console.log(`cjs ok (validator ${version})`);
