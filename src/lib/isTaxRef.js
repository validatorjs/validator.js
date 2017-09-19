import assertString from './util/assertString';

/* eslint-disable max-len */
const references = {
  UK: /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/,
};
/* eslint-enable max-len */

export default function isTaxRef(str, locale) {
  assertString(str);
  if (locale in references) {
    return references[locale].test(str);
  } else if (locale === 'any') {
    for (const key in references) {
      if (references.hasOwnProperty(key)) {
        const reference = references[key];
        if (reference.test(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error(`Invalid locale '${locale}'`);
}
