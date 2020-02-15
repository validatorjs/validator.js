import assertString from './util/assertString';
import { alpha } from './alpha';
export default function isAlpha(str) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';
  assertString(str);

  if (locale in alpha) {
    return alpha[locale].test(str);
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}
export var locales = Object.keys(alpha);