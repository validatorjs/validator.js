import assertString from './util/assertString';
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
    (!options.hasOwnProperty('min') || options.min === undefined || options.min === null || value >= options.min) &&
    (!options.hasOwnProperty('max') || options.max === undefined || options.max === null || value <= options.max) &&
    (!options.hasOwnProperty('lt') || options.lt === undefined || options.lt === null || value < options.lt) &&
    (!options.hasOwnProperty('gt') || options.gt === undefined || options.gt === null || value > options.gt);
}

export const locales = Object.keys(decimal);
