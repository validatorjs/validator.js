import assertString from './util/assertString';

export const vatMatchers = {
  GB: /^GB((\d{3} \d{4} ([0-8][0-9]|9[0-6]))|(\d{9} \d{3})|(((GD[0-4])|(HA[5-9]))[0-9]{2}))$/,
};

export default function isVAT(str, locale) {
  assertString(str);
  assertString(locale);

  if (locale in vatMatchers) {
    return vatMatchers[locale].test(str);
  }
  throw new Error(`Invalid locale '${locale}'`);
}
