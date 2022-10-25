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

export default function isAlpha(_str, options = {}) {
  assertString(_str);

  const { ignore, locale = 'en-US' } = options;
  const str = removeIgnoredCharacters(_str, ignore);

  if (alpha[locale]) {
    return alpha[locale].test(str);
  }

  throw new Error(`Invalid "locale" '${locale}'`);
}

export const locales = Object.keys(alpha);
