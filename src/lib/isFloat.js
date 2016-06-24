import assertString from './util/assertString';
import { float } from './float';

export default function isFloat(str, options) {
  assertString(str);
  options = options || {};
  if (str === '' || str === '.' || str === ',') {
    return false;
  }

  if (!options.hasOwnProperty('locale')) {
    options.locale = 'en-US';
  }

  if (options.locale in float) {
    return float[options.locale].test(str) &&
      (!options.hasOwnProperty('min') || str.replace(',', '.') >= options.min) &&
      (!options.hasOwnProperty('max') || str.replace(',', '.') <= options.max);
  }
  throw new Error(`Invalid locale '${options.locale}'`);
}
