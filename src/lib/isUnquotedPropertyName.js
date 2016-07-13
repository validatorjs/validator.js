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
  forbid_numeric_literals: false,
  forbid_numeric_decimal: false,
  allow_octal_literals: false,
  test_property_initilization: false,
  test_dot_access: false,
  use_brackets_for_numerics: false,
  object_mode: false,
};

export default function isUnquotedPropertyName(value, options) {
  assertString(value);
  options = merge(options, default_property_options);

  let isIdentifierOptions = merge({ object_mode: true }, options);

  let identVal = isIdentifier(value, isIdentifierOptions);

  let valueAsUnescapedString = identVal.valueAsUnescapedString;
  let valueAsNumber = Number(value); // Number('010') returns 10, not 8 :'(

  let isNumeric = !identVal.isValid && isNumericLiteral(value, valueAsNumber);
  let numericInvalid = isNumeric && options.forbid_numeric_literals;
  let isOctal = isNumeric && regexOctalLiteral.test(value);
  let octalInvalid = isOctal && !options.allow_octal_literals;
  let hasDecimal = isNumeric && regexDecimal.test(value);
  let decimalInvalid = hasDecimal && options.forbid_numeric_decimal;

  let propertyInitializationFailure;
  if (options.test_property_initilization) {
    try {
      /* eslint-disable no-new-func */
      Function(`({ ${valueAsUnescapedString} : true })`)();
      /* eslint-enable no-new-func */
      propertyInitializationFailure = false;
    } catch (exception) {
      propertyInitializationFailure = true;
    }
  }

  let dotAccessFailure;
  if (options.test_dot_access) {
    try {
      /* eslint-disable no-new-func, max-len */
      Function(`({ '${valueAsUnescapedString}' : true })${isNumeric && options.use_brackets_for_numerics ? `[${valueAsUnescapedString}]` : `.${valueAsUnescapedString}`}`)();
      /* eslint-enable no-new-func, max-len */
      dotAccessFailure = false;
    } catch (exception) {
      dotAccessFailure = true;
    }
  }

  let needsQuotes;// = propertyInitializationFailure !== undefined && propertyInitializationFailure;
  let needsBrackets;// = dotAccessFailure !== undefined && dotAccessFailure;
  if (isNumeric) {
    needsQuotes = numericInvalid || octalInvalid || decimalInvalid;
    needsBrackets = true;
  } else if (!identVal.isValid) {
    needsQuotes = true;
    needsBrackets = true;
  }

  let isValid = !needsQuotes && !propertyInitializationFailure && !dotAccessFailure;

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
    initializationFailure: identVal.initializationFailure,
    isNumeric,
    isOctal,
    hasDecimal,
    numericInvalid,
    octalInvalid,
    decimalInvalid,
    needsQuotes,
    needsBrackets,
    propertyInitializationFailure,
    dotAccessFailure,
    options,
  };
}
