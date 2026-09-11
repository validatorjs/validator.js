import assertString from './util/assertString';
import isNullOrUndefined from './util/nullUndefinedCheck';
import { decimal } from './alpha';

// The pattern only varies with the decimal separator, which comes from a fixed set of
// locales, so the compiled regexes are cached instead of being rebuilt on every call.
const floatRegexByDecimal = new Map();

function floatRegex(decimalSeparator) {
  let regex = floatRegexByDecimal.get(decimalSeparator);

  if (!regex) {
    regex = new RegExp(`^(?:[-+])?(?:[0-9]+)?(?:\\${decimalSeparator}[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`);
    floatRegexByDecimal.set(decimalSeparator, regex);
  }

  return regex;
}

export default function isFloat(str, options) {
  assertString(str);
  options = options || {};
  const float = floatRegex(options.locale ? decimal[options.locale] : '.');
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
