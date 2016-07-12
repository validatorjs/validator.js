import assertString from './util/assertString';
import merge from './util/merge';
import isIdentifier from './isIdentifier';

// based on https://github.com/mathiasbynens/mothereff.in/blob/master/js-properties/eff.js

/* eslint-disable max-len */
const regexNumber = /^(?![+-])([0-9a-fA-FxX\+\-\.]+)$/;
const regexDecimal = /\./g;
const regexOctalLiteral = /^0[0-7]+$/;
function isNumericLiteral(string, number) {
  // Consider: empty string, `2e2`, `010`, ` 010` (leading space), `1.23`, `.23`, `+1`, `-0`, etc.
  return regexNumber.test(string) && !isNaN(number);
}
/* eslint-enable max-len */

const default_property_options = {
  allow_es3_reserved: true,
  allow_es5_invalid: false,
  allow_es5_reserved: false,
  allow_es6_reserved: false,
  allow_zero_width: false,
  allow_new_unicode: false,
  allow_numeric_literals: true,
  allow_octal_literals: false,
  allow_numeric_decimal: true,
  object_mode: false,
};

export default function isUnquotedPropertyName(value, options) {
  assertString(value);
  options = merge(options, default_property_options);

  let isIdentifierOptions = merge({ allow_immutable_global: true, object_mode: true }, options);

  let identVal = isIdentifier(value, isIdentifierOptions);

  let valueAsUnescapedString = identVal.valueAsUnescapedString;
  let valueAsNumber = Number(value); // Number('010') returns 10, not 8 :'(

  let isNumeric = !identVal.isIdentifierES6 && isNumericLiteral(value, valueAsNumber);
  let numericInvalid = isNumeric && !options.allow_numeric_literals;
  let isOctal = isNumeric && regexOctalLiteral.test(value);
  let octalInvalid = isOctal && !options.allow_octal_literals;
  let hasDecimal = isNumeric && regexDecimal.test(value);
  let decimalInvalid = hasDecimal && !options.allow_numeric_decimal;

  let needsQuotes = identVal.isIdentifierES6
    ? identVal.es6Invalid || identVal.es5Invalid || identVal.es3ReservedInvalid
    || identVal.unicodeInvalid || identVal.hasZeroWidth : numericInvalid || octalInvalid
    || decimalInvalid;
  let needsBrackets = !identVal.isIdentifierES6 || needsQuotes;
  let isValid = !needsQuotes;

  return !options.object_mode ? isValid : {
    value,
    valueAsUnescapedString,
    valueAsNumber,
    isValid,
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
    isNumeric,
    isOctal,
    hasDecimal,
    numericInvalid,
    octalInvalid,
    decimalInvalid,
    needsQuotes,
    needsBrackets,
    options,
  };
}
