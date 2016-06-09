var assert = require('assert');
var validator = require('../index');

describe('Exports', function () {
  it('should export validators', function () {
    assert.equal(typeof validator.isEmail, 'function');
    assert.equal(typeof validator.isAlpha, 'function');
  });

  it('should export sanitizers', function () {
    assert.equal(typeof validator.toBoolean, 'function');
    assert.equal(typeof validator.toFloat, 'function');
  });

  it('should export the version number', function () {
    /* eslint-disable global-require */
    assert.equal(validator.version, require('../package.json').version,
      'Version number mismatch in "package.json" vs. "validator.js"');
    /* eslint-enable global-require */
  });
});
