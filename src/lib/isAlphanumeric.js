import { assertString } from './util/assertString';
import { alphanumeric } from './alpha';

export const isAlphanumeric = (str, locale = 'en-US') => {
  assertString(str);

  if (locale in alphanumeric) {
    return alphanumeric[locale].test(str);
  }

  throw new Error(`Invalid locale '${locale}'`);
}
