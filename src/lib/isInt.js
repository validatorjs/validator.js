import assertString from './util/assertString';

const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;

export default function isInt(str, options) {
  assertString(str);
  options = options || {};
  return int.test(str) && (!options.hasOwnProperty('min') ||
    str >= options.min) && (!options.hasOwnProperty('max') || str <= options.max);
}
