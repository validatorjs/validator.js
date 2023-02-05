import assertString from './util/assertString';
import { alpha } from './alpha';

function removeIgnoredCharacters(str, ignoredCharacters) {
  if (!ignoredCharacters) {
    return str;
  }

  if (ignoredCharacters instanceof RegExp) {
    return str.replace(ignoredCharacters, '');
  }

  if (typeof ignoredCharacters === 'string') {
    return str.replace(new RegExp(`[${ignoredCharacters.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&')}]`, 'g'), ''); // escape regex for 'ignoredCharacters'
  }

  throw new Error('"ignore" should be instance of a String or RegExp');
}

export default function isAlpha(_str, ...args) {
  assertString(_str);

  // For backwards compatibility:
  // isAlpha(str [, locale, options])
  // i.e. `options` could be used as argument for the legacy `locale`
  const locale = (typeof args[0] === 'object' ? args[0].locale : args[0]) || 'en-US';
  const ignore = (typeof args[0] === 'object' ? args[0].ignore : args[1]?.ignore);

  const str = removeIgnoredCharacters(_str, ignore);

  if (alpha[locale]) {
    return alpha[locale].test(str);
  }

  throw new Error(`Invalid "locale" '${locale}'`);
}

export const locales = Object.keys(alpha);
