import assertString from './util/assertString';
import { decimal } from './alpha';

export default function isFloat(str, options) {
  assertString(str);
  options = options || {};
  const splittingChar = options.locale ? decimal[options.locale] : '.';
  const float = new RegExp(`^(?:[-+])?(?:[0-9]+)?(?:\\${splittingChar}[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`);
  if (str === '' || str === '.' || str === '-' || str === '+') {
    return false;
  }
  const value = parseFloat(str.replace(splittingChar, '.'));
  return float.test(str) &&
    value >= (options.min ?? -Infinity) &&
    value <= (options.max ?? Infinity) &&
    value < (options.lt ?? Infinity) &&
    value > (options.gt ?? -Infinity);
}

export const locales = Object.keys(decimal);
