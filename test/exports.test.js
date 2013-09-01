// not to be run on its own...
// to be required in module that already has node_validator defined and passed as param to require
// that way it can be used to test the built versions too when they are compiled

var assert = require('assert');

module.exports = function(node_validator) {

  return {

    'test #Validator is exported when built': function () {
        assert.equal(typeof node_validator.Validator, 'function');
    },

    'test #ValidatorError is exported when built': function () {
        assert.equal(typeof node_validator.ValidatorError, 'function');
    },

    'test #Filter is exported when built': function () {
        assert.equal(typeof node_validator.Filter, 'function');
    },

    'test #validators is exported when built': function () {
        assert.equal(typeof node_validator.validators, 'object');
    },

    'test #defaultError is exported when built': function () {
        assert.equal(typeof node_validator.defaultError, 'object');
    },

    'test #entities is exported when built': function () {
        assert.equal(typeof node_validator.entities, 'object');
    },

    'test #sanitize is exported when built': function () {
        assert.equal(typeof node_validator.sanitize, 'function');
    },

    'test #convert alias for #sanitize is exported when built': function () {
        assert.equal(typeof node_validator.convert, 'function');
        assert.equal(node_validator.convert, node_validator.sanitize);
    },

    'test #check is exported when built': function () {
        assert.equal(typeof node_validator.check, 'function');
    },

    'test #validate alias for #check is exported when built': function () {
        assert.equal(typeof node_validator.validate, 'function');
        assert.equal(node_validator.validate, node_validator.check);
    },

    'test #assert alias for #check is exported when built': function () {
        assert.equal(typeof node_validator.assert, 'function');
        assert.equal(node_validator.assert, node_validator.check);
    }
  }

};