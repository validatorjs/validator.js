import assertString from './util/assertString';
import { decimal } from './alpha';

const numericNoSymbols = /^[0-9]+$/;

export default function isNumeric(str, options) {
  assertString(str);

  if (options && options.no_symbols) {
    return numericNoSymbols.test(str);
  }

  const decimal_char = (options || {}).locale ? decimal[options.locale] : '.';
  if (options && options.thousands_separator) {
    const separator = `${options.thousands_separator || ''}`;
    if (separator.length > 1 || numericNoSymbols.test(separator)) {
      throw new TypeError(`Expected non-numeric single character. Received thousand_separator: ${separator}`);
    } else {
      return new RegExp(`^[+-]?[0-9]{1,3}(${separator}[0-9]{3})*([${decimal_char}][0-9]+)?$`).test(str);
    }
  }

  return (new RegExp(`^[+-]?([0-9]*[${decimal_char}])?[0-9]+$`)).test(str);
}

