import assertString from './util/assertString';
import isNullOrUndefined from './util/nullUndefinedCheck';
import { decimal } from './alpha';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export default function isFloat(str, options) {
  assertString(str);
  options = options || {};
  const float = new RegExp(`^(?:[-+])?(?:[0-9]+)?(?:\\${options.locale ? decimal[options.locale] : '.'}[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`);
  if (str === '' || str === '.' || str === ',' || str === '-' || str === '+') {
    return false;
  }
  const value = parseFloat(str.replace(',', '.'));
  return float.test(str) &&
    (!hasOwnProperty.call(options, 'min') || isNullOrUndefined(options.min) || value >= options.min) &&
    (!hasOwnProperty.call(options, 'max') || isNullOrUndefined(options.max) || value <= options.max) &&
    (!hasOwnProperty.call(options, 'lt') || isNullOrUndefined(options.lt) || value < options.lt) &&
    (!hasOwnProperty.call(options, 'gt') || isNullOrUndefined(options.gt) || value > options.gt);
}

export const locales = Object.keys(decimal);
