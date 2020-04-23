import assertString from './util/assertString';
import { alpha } from './alpha';
export default function isAlpha(str) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  assertString(str);
  var ignore = options.ignore;

  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, '');
    } else if (typeof ignore === 'string') {
      str = str.replace(new RegExp("[".concat(ignore, "]"), 'g'), '');
    } else {
      throw new Error('ignore should be instance of a String or RegExp');
    }
  }

  if (locale in alpha) {
    return alpha[locale].test(str);
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}
export var locales = Object.keys(alpha);