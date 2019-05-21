import assertString from './util/assertString';

/* eslint-disable max-len */
const iban = {
  AD: /^(AD[0-9]{2})\d{8}[0-9A-Z]{12}$/,
  AL: /^(AL[0-9]{2})\d{8}[A-Z0-9]{16}$/,
  AT: /^(AT[0-9]{2})\d{16}$/,
  BA: /^(BA[0-9]{2})\d{16}$/,
  BE: /^(BE[0-9]{2})\d{12}$/,
  BG: /^(BG[0-9]{2})[A-Z]{4}\d{4}[A-Z0-9]{10}$/,
  BH: /^(BH[0-9]{2})[A-Z]{4}[A-Z0-9]{14}$/,
  BR: /^(BR[0-9]{2})\d{23}[A-Z][A-Z0-9]$/,
  CH: /^(CH[0-9]{2})\d{17}$/,
  CY: /^(CY[0-9]{2})\d{8}[A-Z0-9]{16}$/,
  CZ: /^(CZ[0-9]{2})\d{20}$/,
  DE: /^(DE[0-9]{2})\d{18}$/,
  DK: /^(DK[0-9]{2})\d{14}$/,
  EE: /^(EE[0-9]{2})\d{16}$/,
  ES: /^(ES[0-9]{2})\d{20}$/,
  FO: /^(FO[0-9]{2})\d{14}$/,
  FI: /^(FI[0-9]{2})\d{14}$/,
  FR: /^(FR[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
  GB: /^(GB[0-9]{2})[A-Z]{4}\d{14}$/,
  GE: /^(GE[0-9]{2})[A-Z]{2}\d{16}$/,
  GI: /^(GI[0-9]{2})[A-Z]{4}[A-Z0-9]{15}$/,
  GL: /^(GL[0-9]{2})\d{14}$/,
  GR: /^(GR[0-9]{2})\d{7}[A-Z0-9]{16}$/,
  HR: /^(HR[0-9]{2})\d{17}$/,
  HU: /^(HU[0-9]{2})\d{24}$/,
  IE: /^(IE[0-9]{2})[A-Z]{4}\d{14}$/,
  IS: /^(IS[0-9]{2})\d{22}$/,
  IT: /^(IT[0-9]{2})[A-Z]\d{10}[A-Z0-9]{12}$/,
  JO: /^(JO[0-9]{2})[A-Z]{4}\d{4}[A-Z0-9]{18}$/,
  KW: /^(KW[0-9]{2})[A-Z]{4}[A-Z0-9]{22}$/,
  KZ: /^(KZ[0-9]{2})\d{3}[A-Z0-9]{13}$/,
  LB: /^(LB[0-9]{2})\d{4}[A-Z0-9]{20}$/,
  LI: /^(LI[0-9]{2})\d{5}[A-Z0-9]{12}$/,
  LT: /^(LT[0-9]{2})\d{16}$/,
  LU: /^(LU[0-9]{2})\d{3}[A-Z0-9]{13}$/,
  LV: /^(LV[0-9]{2})[A-Z]{4}[A-Z0-9]{13}$/,
  MC: /^(MC[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
  MD: /^(MD[0-9]{2})[A-Z]{2}[A-Z0-9]{18}$/,
  ME: /^(ME[0-9]{2})\d{18}$/,
  MK: /^(MK[0-9]{2})\d{3}[A-Z0-9]{12}$/,
  MT: /^(MT[0-9]{2})[A-Z]{4}\d{5}[A-Z0-9]{18}$/,
  NL: /^(NL[0-9]{2})[A-Z]{4}\d{10}$/,
  NO: /^(NO[0-9]{2})\d{11}$/,
  PL: /^(PL[0-9]{2})\d{24}$/,
  PS: /^(PS[0-9]{2})[A-Z]{4}[A-Z0-9]{21}$/,
  PT: /^(PT[0-9]{2})\d{21}$/,
  QA: /^(QA[0-9]{2})[A-Z]{4}[A-Z0-9]{21}$/,
  RO: /^(RO[0-9]{2})[A-Z]{4}[A-Z0-9]{16}$/,
  SA: /^(SA[0-9]{2})\d{2}[A-Z0-9]{18}$/,
  SE: /^(SE[0-9]{2})\d{20}$/,
  SI: /^(SI[0-9]{2})\d{15}$/,
  SK: /^(SK[0-9]{2})\d{20}$/,
  SM: /^(SM[0-9]{2})[A-Z]{1}\d{10}[A-Z0-9]{12}$/,
  RS: /^(RS[0-9]{2})\d{18}$/,
  TN: /^(TN[0-9]{2})\d{20}$/,
  TR: /^(TR[0-9]{2})\d{5}[A-Z0-9]{17}$/,
  UA: /^(UA[0-9]{2})\d{6}[A-Z0-9]{19}$/,
  XK: /^(XK[0-9]{2})\d{16}$/,
};
/* eslint-enable max-len */

/**
 * @function IbanCalcul - calculate if the IBAN corresponds to the reglementation: converting
 * it into an integer and performing a basic mod-97 operation. If the IBAN is valid, the remainder
 * equals 1.
 *  1- Check that the total IBAN length is correct as per the country. If not, the IBAN is invalid
 *  2- Move the four initial characters to the end of the string
 *  3- Replace each letter in the string with two digits, thereby expanding the string,
 *     where A = 10..., Z = 35
 *  4- Interpret the string as a decimal integer and compute the remainder of that number on
 *     division by 97
 * @param {e} - recieves the IBAN tested
 * @warns IBAN's length differs from country to another, the maximum length is 34 characters so
 * calculating its modulus 97 is not possible for all machines.To solve this, the function calculate
 * the modulus of the first 9 digit by 97 and add the result to the beginning of the remain IBAN
 * number. The process is repeated untill the result's length is less than 10
 */
const IbanCalcul = (e) => {
  const countryCode = e.slice(0, 4);
  let result = e.slice(4, e.length) + countryCode;
  for (let counter = 1; counter <= Math.ceil(e.length / 10) + 1; counter++) {
    let remainder =
      result.slice(0, 10).replace(/[A-Z]/g, element => element.charCodeAt() - 55) % 97;
    result = remainder + result.slice(10);
  }
  if (result === '1') return true;
  return false;
};

export default function isIBAN(str, locale) {
  assertString(str);
  str = str.toUpperCase();
  if (locale in iban) {
    return iban[locale].test(str) && IbanCalcul(str);
  } else if (!locale || locale === 'any') {
    locale = str.slice(0, 2);
    if (locale in iban) {
      return iban[locale].test(str) && IbanCalcul(str);
    }
    return false;
  }
  throw new Error(`Invalid locale '${locale}'`);
}

export const locales = Object.keys(iban);
