import assertString from './util/assertString';

/* eslint-disable max-len */
const nationalities = {
  'ar-BH': /^(\d{2})(0[1-9]|1[0-2])(\d{5})$/,
  'bn-BD': /^[0-9]{13,17}$/,
  'en-HK': /^[A-Z]{1,2}\d{10}(([\d|A]{1})|(\([\d|A]{1}\)))$/,
  'en-IN': /^(?!0|1)\d{4}\s\d{4}\s\d{4}$/, // Alternate /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/
  'en-PH': /^\d{4}-\d{4}-\d{4}$/,
  'en-PK': /^\d{5}-\d{7}-\d$/,
  'en-SG': /^[STFG]\d{7}[A-Z]$/,
  'es-CL': /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/,
  'es-CU': /^[1-9]\d{2} [0-9]{3} [0-9]{5} [0-9]$/,
  'fr-FR': /^(1|2)\d{2}(0[1-9]|1[0-2])\d{2}([0-8]\d|2A|2B|9[0-5]|9[7-9]|[3-8]\d{2})\d{3}(\s|-){0,1}\d{2}$/,
  'id-ID': /^([0-9]{6})(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(\d{6})$/,
  'ms-MY': /^[1-9][0-9]{5}-[0-9]{2}-[0-9]{4}$/,
  'pt-BR': /^\d{1,2}\.\d{3}\.\d{3}-\d{1}$/,
  'zh-CN': /^[0-9]{10}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[0-9|X]$/,
};
/* eslint-enable max-len */

nationalities['zh-HK'] = nationalities['en-HK'];

export default function isNationalId(str, locale) {
  assertString(str);
  if (Array.isArray(locale)) {
    return locale.some((key) => {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      if (nationalities.hasOwnProperty(key)) {
        const id = nationalities[key];
        if (id.test(str)) {
          return true;
        }
      }
      return false;
    });
  } else if (locale in nationalities) {
    return nationalities[locale].test(str);
    // alias falsey locale as 'any'
  } else if (!locale || locale === 'any') {
    for (const key in nationalities) {
      if (nationalities.hasOwnProperty(key)) {
        const id = nationalities[key];
        if (id.test(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error(`Invalid locale '${locale}'`);
}

export const locales = Object.keys(nationalities);
