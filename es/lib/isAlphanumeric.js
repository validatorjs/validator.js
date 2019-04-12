import assertString from './util/assertString';
import { alphanumeric } from './alpha';
export default function isAlphanumeric(str) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';
  assertString(str);

  if (locale in alphanumeric) {
    return alphanumeric[locale].test(str);
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}
export var locales = Object.keys(alphanumeric);