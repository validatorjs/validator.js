var assert = require('assert')
  , validator = require('../validator');

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
        assert.equal(validator.version, require('../package.json').version,
            'Version number mismatch in "package.json" vs. "validator.js"');
    });

});
