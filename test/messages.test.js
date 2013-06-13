var util = require('util')
    Validator = require('../lib').Validator,
    assert = require('assert');
  Validator.prototype.error = function (msg) {
      this._errors.push(msg);
      return this;
  }

  Validator.prototype.getErrors = function () {
      return this._errors;
  }

  var testData = {
    number: 'ff'
  }

    module.exports = {
      'test: multiple custom messages': function  () {
        var v = new Validator();
          v.check(testData.number, {
            isNumeric: 'testData.number should be a real number',
            contains: 'testData.number should contain a 0'
          }).isNumeric().contains('0');

        errors = v.getErrors();

        assert.equal(errors.length, 2)
        assert.equal(errors[0], 'testData.number should be a real number')
        assert.equal(errors[1], 'testData.number should contain a 0')
      },
      'test: one custom message, one default': function() {
        var v = new Validator();
          v.check(testData.number, {
            isNumeric: 'testData.number should be a real number'
          }).isNumeric().contains('0');

        errors = v.getErrors();

        assert.equal(errors.length, 2)
        assert.equal(errors[0], 'testData.number should be a real number')
        assert.equal(errors[1], 'Invalid characters')
      },
      'test: global error message': function() {
        var v = new Validator();
          v.check(testData.number, 'The value you entered is not valid').isNumeric().contains('0');

        errors = v.getErrors();

        assert.equal(errors.length, 2)
        assert.equal(errors[0], 'The value you entered is not valid')
        assert.equal(errors[1], 'The value you entered is not valid')
      },
      'test: custom message for a validation that is not used': function() {
        var v = new Validator();
          v.check(testData.number, {
            isNumeric: 'testData.number should be a real number',
            isInt: 'testData.number should be an Integer'
          }).isNumeric().contains('0');

        errors = v.getErrors();

        assert.equal(errors.length, 2)
        assert.equal(errors[0], 'testData.number should be a real number')
        assert.equal(errors[1], 'Invalid characters')
      }
    }