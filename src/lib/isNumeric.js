import assertString from './util/assertString';
import { decimal } from './alpha';

const numericNoSymbols = /^[0-9]+$/;

export default function isNumeric(str, options) {
  assertString(str);

  if (options && options.no_symbols) {
    return numericNoSymbols.test(str);
  }

  const decimal_char = (options || {}).locale ? decimal[options.locale] : '.';
  if (options && options.thousand_separator) {
    return new RegExp(`^[+-]?[0-9]{1,3}(${options.thousand_separator}[0-9]{3})*([${decimal_char}][0-9]+)?$`).test(str);
  }

  return (new RegExp(`^[+-]?([0-9]*[${decimal_char}])?[0-9]+$`)).test(str);
}
