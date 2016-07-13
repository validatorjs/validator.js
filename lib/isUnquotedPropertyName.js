'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isUnquotedPropertyName;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

var _isIdentifier = require('./isIdentifier');

var _isIdentifier2 = _interopRequireDefault(_isIdentifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// based on https://github.com/mathiasbynens/mothereff.in/blob/master/js-properties/eff.js

/* eslint-disable max-len */
var regexNumber = /^(?![+-])([0-9a-fA-FxX\+\-\.]+)$/;
var regexDecimal = /\./g;
var regexOctalLiteral = /^0[0-7]+$/;
function isNumericLiteral(string, number) {
  // Consider: empty string, `2e2`, `010`, ` 010` (leading space), `1.23`, `.23`, `+1`, `-0`, etc.
  return regexNumber.test(string) && !isNaN(number);
}
/* eslint-enable max-len */

var default_property_options = {
  forbid_numeric_literals: false,
  forbid_numeric_decimal: false,
  allow_octal_literals: false,
  test_propety_initilization: false,
  test_dot_access: false,
  object_mode: false
};

function isUnquotedPropertyName(value, options) {
  (0, _assertString2.default)(value);
  options = (0, _merge2.default)(options, default_property_options);

  var isIdentifierOptions = (0, _merge2.default)({ object_mode: true }, options);

  var identVal = (0, _isIdentifier2.default)(value, isIdentifierOptions);

  var valueAsUnescapedString = identVal.valueAsUnescapedString;
  var valueAsNumber = Number(value); // Number('010') returns 10, not 8 :'(

  var isNumeric = !identVal.isIdentifierES6 && isNumericLiteral(value, valueAsNumber);
  var numericInvalid = isNumeric && options.forbid_numeric_literals;
  var isOctal = isNumeric && regexOctalLiteral.test(value);
  var octalInvalid = isOctal && !options.allow_octal_literals;
  var hasDecimal = isNumeric && regexDecimal.test(value);
  var decimalInvalid = hasDecimal && options.forbid_numeric_decimal;

  var needsQuotes = true;
  if (identVal.isIdentifierES6) {
    needsQuotes = !identVal.isValid;
  } else if (isNumeric) {
    needsQuotes = numericInvalid || octalInvalid || decimalInvalid;
  }
  var needsBrackets = !identVal.isIdentifierES6 || needsQuotes;
  var isValid = !needsQuotes;

  var propertyInitializationFailure = options.test_propety_initilization && function () {
    try {
      /* eslint-disable no-new-func */
      Function('{ ' + valueAsUnescapedString + ' : true };');
      /* eslint-enable no-new-func */
      return false;
    } catch (exception) {
      return true;
    }
  }();

  var dotAccessFailure = options.test_dot_access && function () {
    try {
      /* eslint-disable no-new-func */
      Function('({ \'' + valueAsUnescapedString + '\' : true }).' + valueAsUnescapedString + ';');
      /* eslint-enable no-new-func */
      return false;
    } catch (exception) {
      return true;
    }
  }();

  return !options.object_mode ? isValid : {
    value: value,
    valueAsUnescapedString: valueAsUnescapedString,
    valueAsNumber: valueAsNumber,
    isValid: isValid,
    isIdentifierES5: identVal.isIdentifierES5,
    isIdentifierES6: identVal.isIdentifierES6,
    isEs3Reserved: identVal.isEs3Reserved,
    isEs5Reserved: identVal.isEs5Reserved,
    isEs6Reserved: identVal.isEs6Reserved,
    es3ReservedInvalid: identVal.es3ReservedInvalid,
    es5Invalid: identVal.es5Invalid,
    es6Invalid: identVal.es6Invalid,
    hasNewUnicode: identVal.hasNewUnicode,
    hasZeroWidth: identVal.hasZeroWidth,
    unicodeInvalid: identVal.unicodeInvalid,
    zeroWidthInvalid: identVal.zeroWidthInvalid,
    initializationFailure: identVal.initializationFailure,
    isNumeric: isNumeric,
    isOctal: isOctal,
    hasDecimal: hasDecimal,
    numericInvalid: numericInvalid,
    octalInvalid: octalInvalid,
    decimalInvalid: decimalInvalid,
    needsQuotes: needsQuotes,
    needsBrackets: needsBrackets,
    propertyInitializationFailure: propertyInitializationFailure,
    dotAccessFailure: dotAccessFailure,
    options: options
  };
}
module.exports = exports['default'];