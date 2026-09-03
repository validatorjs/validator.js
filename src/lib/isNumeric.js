import assertString from './util/assertString';
import merge from './util/merge';
import { decimal } from './alpha';

const numericNoSymbols = /^[0-9]+$/;

const defaultNumericOptions = {
  no_symbols: false,
  thousands_separator: '',
};

const allowedSeparators = '., _';
const regexSpecialChars = /[.*+?^${}()|[\]\\]/g;

export default function isNumeric(str, options) {
  assertString(str);
  options = merge(options, defaultNumericOptions);

  if (options.no_symbols) {
    return numericNoSymbols.test(str);
  }

  const decimal_char = options.locale ? decimal[options.locale] : '.';
  if (options.thousands_separator) {
    const separator = `${options.thousands_separator}`;
    if (separator.length > 1 || allowedSeparators.indexOf(separator) === -1) {
      throw new TypeError(`Expected single character: comma, dot, space, or underscore. Received thousand_separator: ${separator}`);
    } else {
      const escaped_separator = separator.replace(regexSpecialChars, '\\$&');
      return new RegExp(`^[+-]?[0-9]{1,3}(${escaped_separator}[0-9]{3})*([${decimal_char}][0-9]+)?$`).test(str);
    }
  }

  return (new RegExp(`^[+-]?([0-9]*[${decimal_char}])?[0-9]+$`)).test(str);
}
