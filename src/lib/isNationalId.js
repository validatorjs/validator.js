import assertString from './util/assertString';

// https://en.wikipedia.org/wiki/National_identification_number
/* eslint-disable max-len */
const nationalities = {
  'ar-AE': /^784-\d{4}-\d{7}-\d$/,
  'ar-BH': /^(\d{2})(0[1-9]|1[0-2])(\d{5})$/,
  'ar-KW': /^[1-2]{1}\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])[1-2]{1}\d{4}$/,
  'bn-BD': /^[0-9]{13,17}$/,
  'de-AT': /^\d{9,12}$/,
  'en-HK': /^[A-Z]{1,2}\d{10}(([\d|A]{1})|(\([\d|A]{1}\)))$/,
  'en-IE': /^\d{7}[A-Z](\/[A|H|W]){0,1}$/,
  'en-IN': /^(?!0|1)\d{4}\s\d{4}\s\d{4}$/, // Alternate /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/
  'en-MO': /^(1|5|7)\d{6}(\d|\(\d\))$/,
  'en-PH': /^\d{4}-\d{4}-\d{4}$/,
  'en-PK': /^\d{5}-\d{7}-\d$/,
  'en-SG': /^[STFG]\d{7}[A-Z]$/,
  'es-CL': /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/,
  'es-CU': /^[1-9]\d{2} [0-9]{3} [0-9]{5} [0-9]$/,
  'fa-IR': /^\d{3}-\d{6}-\d{1}$/,
  'fr-FR': /^(1|2)(\d{2})(0[1-9]|1[0-2])(([A-Z][0-9])|([0-9]{2,3}))(\d{2,3})(\d{5})$/, // INSEE code
  'fr-LU': /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{5}$/,
  'id-ID': /^([0-9]{6})(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(\d{6})$/,
  'ir-IR': /^[1-9]{1}\d{1}-\d{3}-\d{6}$/,
  'is-IS': /^(0[1-9]|[1-2]\d|3[0-1])(0[1-9]|1[0-2])\d{2}-\d{4}$/,
  'it-IT': /^[A-Z]{6}\d{2}[A|B|C|D|E|H|L|M|P|R|S|T]((0[1-9]|[1-2]\d|3[0-1])|(4[1-9]|[5-6]\d|7[0-1]))([A-Z]\d{3})([A-Z]|[0-9])$/,
  'ja-JP': /^\d{12}$/,
  'ko-KR': /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])-\d{7}$/,
  'mk-MK': /^(0[1-9]|[1-2]\d|3[0-1])(0[1-9]|1[0-2])\d{3}(04|(4[1-9]))((0[0-9][0-9]|[1-3][0-9][0-9]|400)|(5[0-9][0-9]|[6-9][0-9][0-9]))\d$/,
  'ms-MY': /^[1-9][0-9]{5}-[0-9]{2}-[0-9]{4}$/,
  'pt-BR': /^\d{1,2}\.\d{3}\.\d{3}-\d{1}$/,
  'si-LK': /^((\d{12})|(\d{9}[V|X]))$/,
  'sq-AL': /^([A-Z]{0,1}[0-9]{1,2})((0[1-9]|1[0-2])|(5[1-9]|6[0-2]))(0[1-9]|[1-2]\d|3[0-1])((?!000)(0[0-9][0-9]|[1-9][0-9][0-9]))[A-Z]$/,
  'th-TH': /^\d-\d{4}-\d{5}-\d{2}-\d$/,
  'vir-VN': /^\d{9}[0|1]\d{2}$/,
  'zh-CN': /^[0-9]{10}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[0-9|X]$/,
  'zh-TW': /^[A-Z][1|2]\d{8}$/,
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
