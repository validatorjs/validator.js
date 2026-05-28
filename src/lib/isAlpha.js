import assertString from './util/assertString';
import { alpha } from './alpha';

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

  if (locale in alpha) {
    return alpha[locale].test(str);
  }
  throw new Error(`Invalid locale '${locale}'`);
}

export const locales = Object.keys(alpha);
