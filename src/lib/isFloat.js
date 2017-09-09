import assertString from './util/assertString';
import { decimal } from './alpha';

export default function isFloat(str, options) {
  assertString(str);
  options = options || {};
  const float = new RegExp(`^(?:[-+])?(?:[0-9]+)?(?:\\${options.locale ? decimal[options.locale] : '.'}[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`);
  if (str === '' || str === '.') {
    return false;
  }
  return float.test(str) &&
    (!options.hasOwnProperty('min') || str >= options.min) &&
    (!options.hasOwnProperty('max') || str <= options.max) &&
    (!options.hasOwnProperty('lt') || str < options.lt) &&
    (!options.hasOwnProperty('gt') || str > options.gt);
}
