import assertString from './util/assertString';
import { alphanumeric, removeIgnoredCharacters } from './alpha';

export default function isAlphanumeric(_str, options = {}) {
  assertString(_str);

  const { ignore, locale = 'en-US' } = options;
  const str = removeIgnoredCharacters(_str, ignore);

  if (alphanumeric[locale]) {
    return alphanumeric[locale].test(str);
  }

  throw new Error(`Invalid "locale" '${locale}'`);
}

export const locales = Object.keys(alphanumeric);
