var assert = require('assert')
  , validator = require('../');

describe('Exports', function () {

    it('should export patterns', function () {
        assert.equal(typeof validator.patterns, 'object');
    });

    it('should export validators', function () {
        assert.equal(typeof validator.validators, 'object');
    });

    it('should export entities', function () {
        assert.equal(typeof validator.entities, 'object');
    });

    it('should export default error messages', function () {
        assert.equal(typeof validator.defaultError, 'object');
    });

    it('should export classes', function () {
        assert.equal(typeof validator.Filter, 'function');
        assert.equal(typeof validator.Validator, 'function');
        assert.equal(typeof validator.ValidatorError, 'function');
    });

    it('should export shortcut functions', function () {
        validator.check('foo@bar.com').isEmail();
        assert.equal(validator.sanitize('1').toBoolean(), true);
    });

    it('should export the version number', function () {
        assert.equal(validator.version, require('../package.json').version,
            'Version number mismatch between package.json and validator.version in index.js');
    });

});
