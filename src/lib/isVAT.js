import assertString from './util/assertString';

export const vatMatchers = {
  'en-GB': [
    /^GB\d{3} \d{4} ([0-8][0-9]|9[0-6])$/,
    /^GB\d{9} \d{3}$/,
    /^GBGD[0-4][0-9]{2}$/,
    /^GBHA[5-9][0-9]{2}$/,
  ],
};

export default function isVAT(str, locale) {
  assertString(str);
  assertString(locale);

  if (locale in vatMatchers) {
    for (let matcher of vatMatchers[locale]) {
      if (matcher.test(str)) {
        return true;
      }
    }
    return false;
  }
  throw new Error(`Invalid locale '${locale}'`);
}
