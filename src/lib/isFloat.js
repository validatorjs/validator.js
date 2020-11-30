import assertString from './util/assertString';
import { decimal } from './alpha';
import hasOption from './util/hasOption';

export default function isFloat(str, options) {
  assertString(str);
  options = options || {};
  const float = new RegExp(`^(?:[-+])?(?:[0-9]+)?(?:\\${options.locale ? decimal[options.locale] : '.'}[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`);
  if (str === '' || str === '.' || str === '-' || str === '+') {
    return false;
  }
  const value = parseFloat(str.replace(',', '.'));
  return float.test(str) &&
    (!hasOption(options, 'min') || value >= options.min) &&
    (!hasOption(options, 'max') || value <= options.max) &&
    (!hasOption(options, 'lt') || value < options.lt) &&
    (!hasOption(options, 'gt') || value > options.gt);
}

export const locales = Object.keys(decimal);
