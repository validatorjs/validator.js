import assertString from './util/assertString';
import validateNationalIdChecksum from './util/nationalIdChecksum';

/**
 * References:
 * https://en.wikipedia.org/wiki/National_identification_number -- Wikipedia
 */
/* eslint-disable max-len */
const nationalities = {
  AE: /^784-\d{4}-\d{7}-\d$/,
  CA: /^\d{3}[-\s\.]{0,1}\d{3}[-\s\.]{0,1}\d{3}$/,
  BH: /^(\d{2})(0[1-9]|1[0-2])(\d{5})$/,
  KW: /^[1-2]{1}\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])[1-2]{1}\d{4}$/,
  BD: /^[0-9]{13,17}$/,
  AT: /^\d{9,12}$/,
  HK: /^[A-Z]{1,2}\d{10}(([\dA]{1})|(\([\dA]{1}\)))$/,
  IE: /^\d{7}[A-Z](\/[AHW]){0,1}$/,
  IN: /^(?!0|1)\d{4}\s\d{4}\s\d{4}$/, // Alternate /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/
  MO: /^(157)\d{6}(\d|\(\d\))$/,
  PH: /^\d{4}-\d{4}-\d{4}$/,
  PK: /^\d{5}-\d{7}-\d$/,
  SG: /^[STFG]\d{7}[A-Z]$/,
  CL: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/,
  CU: /^[1-9]\d{2} [0-9]{3} [0-9]{5} [0-9]$/,
  FR: /^[12](\d{2})(0[1-9]|1[0-2])(([A-Z][0-9])|([0-9]{2,3}))(\d{2,3})(\d{5})$/, // INSEE code
  // /(^[12](\d{2})(0[1-9]|1[0-2])(([A-Z][0-9])|([0-9]{2,3}))(\d{2,3})(\d{5})$)|(^[A-Z0-9]{9}$)/ INSEE & Document no.
  LU: /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{5}$/,
  ID: /^([0-9]{6})(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(\d{6})$/,
  IR: /^([1-9]{1}\d{1}-\d{3}-\d{6})|(\d{3}-\d{6}-\d{1})$/,
  IS: /^(0[1-9]|[1-2]\d|3[0-1])(0[1-9]|1[0-2])\d{2}-\d{4}$/,
  IT: /^[A-Z]{6}\d{2}[A-EHLMPRST]((0[1-9]|[1-2]\d|3[0-1])|(4[1-9]|[5-6]\d|7[0-1]))([A-Z]\d{3})([A-Z]|[0-9])$/,
  JP: /^\d{12}$/,
  KR: /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])-\d{7}$/,
  MK: /^(0[1-9]|[1-2]\d|3[0-1])(0[1-9]|1[0-2])\d{3}((00|04|09)|(4[1-9])|(6[0-9]))((0[0-9][0-9]|[1-3][0-9][0-9]|400)|(5[0-9][0-9]|[6-9][0-9][0-9]))\d$/,
  MX: /^[A-Z]{4}\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])[HMX][A-Z]{5}([0-9]|[A-Z])\d$/,
  MY: /^[1-9][0-9]{5}-[0-9]{2}-[0-9]{4}$/,
  BR: /^\d{1,2}\.\d{3}\.\d{3}-\d{1}$/,
  LK: /^((\d{12})|(\d{9}[VX]))$/,
  AL: /^([A-Z]{0,1}[0-9]{1,2})((0[1-9]|1[0-2])|(5[1-9]|6[0-2]))(0[1-9]|[1-2]\d|3[0-1])((?!000)(0[0-9][0-9]|[1-9][0-9][0-9]))[A-Z]$/,
  TH: /^\d-\d{4}-\d{5}-\d{2}-\d$/,
  VN: /^\d{9}[01]\d{2}$/,
  CN: /^[0-9]{10}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[0-9|X]$/,
  TW: /^[A-Z][12]\d{8}$/,
  BA: /^(0[1-9]|[1-2]\d|3[0-1])(0[1-9]|1[0-2])\d{3}((00|01|09)|(1[0-9])|(6[0-9]))((0[0-9][0-9]|[1-3][0-9][0-9]|400)|(5[0-9][0-9]|[6-9][0-9][0-9]))\d$/,
  ME: /^(0[1-9]|[1-2]\d|3[0-1])(0[1-9]|1[0-2])\d{3}((00|02|09)|(2[0-9])|(6[0-9]))((0[0-9][0-9]|[1-3][0-9][0-9]|400)|(5[0-9][0-9]|[6-9][0-9][0-9]))\d$/,
  HR: /^(0[1-9]|[1-2]\d|3[0-1])(0[1-9]|1[0-2])\d{3}((00|03|09)|(3[0-9])|(6[0-9]))((0[0-9][0-9]|[1-3][0-9][0-9]|400)|(5[0-9][0-9]|[6-9][0-9][0-9]))\d$/,
  SI: /^(0[1-9]|[1-2]\d|3[0-1])(0[1-9]|1[0-2])\d{3}((00|05|09)|(5[0-9])|(6[0-9]))((0[0-9][0-9]|[1-3][0-9][0-9]|400)|(5[0-9][0-9]|[6-9][0-9][0-9]))\d$/,
  RS: /^(0[1-9]|[1-2]\d|3[0-1])(0[1-9]|1[0-2])\d{3}((00|06|07|09)|(7[0-9])|(8[0-9])|(6[0-9]))((0[0-9][0-9]|[1-3][0-9][0-9]|400)|(5[0-9][0-9]|[6-9][0-9][0-9]))\d$/,
  XK: /^(0[1-9]|[1-2]\d|3[0-1])(0[1-9]|1[0-2])\d{3}((00|08|09)|(9[0-9])|(6[0-9]))((0[0-9][0-9]|[1-3][0-9][0-9]|400)|(5[0-9][0-9]|[6-9][0-9][0-9]))\d$/,
  BE: /^(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])-\d{3}-\d{2})|(\d{2}\.(0[1-9]|1[0-2])\.(0[1-9]|[1-2]\d|3[0-1])-\d{3}\.\d{2})$/,
  BG: /^\d{2}((0[1-9]|1[0-2])|(2[1-9]|3[0-2])|(4[1-9]|5[0-2]))(0[1-9]|[1-2]\d|3[0-1])\d{4}$/,
};
/* eslint-enable max-len */

/**
 * @param {string} str
 * @param {string | string[]} countryCode
 * @param {{strictMode: boolean}} options
 * @returns {boolean}
 */
export default function isNationalId(str, countryCode, options) {
  assertString(str);
  const strictMode = options && options.strictMode;
  if (Array.isArray(countryCode)) {
    return countryCode.some((key) => {
      // istanbul ignore else
      if ((nationalities.hasOwnProperty(key)) && nationalities[key].test(str)) {
        if (strictMode) {
          return validateNationalIdChecksum(str, key);
        }
        return true;
      }
      return false;
    });
    // alias falsy countryCode as 'any'
  } else if (!countryCode || countryCode === 'any') {
    for (const key in nationalities) {
      // istanbul ignore else
      if (nationalities.hasOwnProperty(key) && nationalities[key].test(str)) {
        if (strictMode) {
          return validateNationalIdChecksum(str, key);
        }
        return true;
      }
    }
    return false;
  } else if (countryCode in nationalities) {
    if (nationalities[countryCode].test(str)) {
      if (strictMode) {
        return validateNationalIdChecksum(str, countryCode);
      }
      return true;
    }
    return false;
  }
  throw new Error(`Invalid country code '${countryCode}'`);
}

export const countryCodes = Object.keys(nationalities);
