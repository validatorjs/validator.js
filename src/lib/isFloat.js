import assertString from './util/assertString';

const float = /^(?:[-+])?(?:[0-9]+)?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/;

export default function isFloat(str, options) {
  assertString(str);
  options = options || {};
  if (str === '' || str === '.') {
    return false;
  }
  return float.test(str) &&
    (!options.hasOwnProperty('min') || str >= options.min) &&
    (!options.hasOwnProperty('max') || str <= options.max) &&
    (!options.hasOwnProperty('lt') || str < options.lt) &&
    (!options.hasOwnProperty('gt') || str > options.gt);
}
