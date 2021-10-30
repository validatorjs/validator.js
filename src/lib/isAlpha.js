import assertString from './util/assertString';
import { alpha } from './alpha';


function getLocaleChars(locale) {
  if (locale in alpha) {
    return alpha[locale];
  }
  throw new Error(`Invalid locale '${locale}'`);
}

function buildRegex(locale) {
  let allowedCharRanges = '';
  if (Array.isArray(locale)) {
    if (locale.length === 0) {
      throw new Error('No locales specified');
    }
    allowedCharRanges = locale.map(l => getLocaleChars(l)).join('');
  } else {
    allowedCharRanges = getLocaleChars(locale);
  }

  return new RegExp(`^[${allowedCharRanges}]+$`, 'i');
}

export default function isAlpha(_str, locale = 'en-US', options = {}) {
  assertString(_str);

  let str = _str;
  const { ignore } = options;

  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, '');
    } else if (typeof ignore === 'string') {
      str = str.replace(new RegExp(`[${ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&')}]`, 'g'), ''); // escape regex for ignore
    } else {
      throw new Error('ignore should be instance of a String or RegExp');
    }
  }

  const regex = buildRegex(locale);
  return regex.test(str);
}

export const locales = Object.keys(alpha);
