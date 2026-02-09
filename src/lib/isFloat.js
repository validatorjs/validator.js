import assertString from './util/assertString';
import isNullOrUndefined from './util/nullUndefinedCheck';
import { decimal } from './alpha';

export default function isFloat(str, options) {
  assertString(str);
  options = options || {};
  const float = new RegExp(`^(?:[-+])?(?:[0-9]+)?(?:\\${options.locale ? decimal[options.locale] : '.'}[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`);
  if (str === '' || str === '.' || str === ',' || str === '-' || str === '+') {
    return false;
  }
  const value = parseFloat(str.replace(',', '.'));
  return float.test(str) &&
    (!options.hasOwnProperty('min') || isNullOrUndefined(options.min) || value >= options.min) &&
    (!options.hasOwnProperty('max') || isNullOrUndefined(options.max) || value <= options.max) &&
    (!options.hasOwnProperty('lt') || isNullOrUndefined(options.lt) || value < options.lt) &&
    (!options.hasOwnProperty('gt') || isNullOrUndefined(options.gt) || value > options.gt);
}

export const locales = Object.keys(decimal);
