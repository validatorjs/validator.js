import { assertString } from './util/assertString';
import { alpha } from './alpha';

export const isAlpha = (str, locale = 'en-US') => {
  assertString(str);

  if (locale in alpha) {
    return alpha[locale].test(str);
  }

  throw new Error(`Invalid locale '${locale}'`);
}
