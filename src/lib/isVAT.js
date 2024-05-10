import assertString from './util/assertString';
import * as algorithms from './util/algorithms';

const AU = (str) => {
  const match = str.match(/^(AU)?(\d{11})$/);
  if (!match) {
    return false;
  }
  // @see {@link https://abr.business.gov.au/Help/AbnFormat}
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  str = str.replace(/^AU/, '');
  const ABN = (parseInt(str.slice(0, 1), 10) - 1).toString() + str.slice(1);
  let total = 0;
  for (let i = 0; i < 11; i++) {
    total += weights[i] * ABN.charAt(i);
  }
  return (total !== 0 && total % 89 === 0);
};

const CH = (str) => {
  // @see {@link https://www.ech.ch/de/ech/ech-0097/5.2.0}
  const hasValidCheckNumber = (digits) => {
    const lastDigit = digits.pop(); // used as check number
    const weights = [5, 4, 3, 2, 7, 6, 5, 4];
    const calculatedCheckNumber = (11 - (digits.reduce((acc, el, idx) => acc + (el * weights[idx]), 0) % 11)) % 11;

    return lastDigit === calculatedCheckNumber;
  };

  // @see {@link https://www.estv.admin.ch/estv/de/home/mehrwertsteuer/uid/mwst-uid-nummer.html}
  return /^(CHE[- ]?)?(\d{9}|(\d{3}\.\d{3}\.\d{3})|(\d{3} \d{3} \d{3})) ?(TVA|MWST|IVA)?$/.test(str) && hasValidCheckNumber((str.match(/\d/g).map((el) => +el)));
};

const PT = (str) => {
  const match = str.match(/^(PT)?(\d{9})$/);
  if (!match) {
    return false;
  }

  const tin = match[2];

  const checksum = 11 - (algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 8).map((a) => parseInt(a, 10)), 9) % 11);
  if (checksum > 9) {
    return parseInt(tin[8], 10) === 0;
  }
  return checksum === parseInt(tin[8], 10);
};

export const vatMatchers = {
  /**
   * European Union VAT identification numbers
   */
  AT: (str) => /^(AT)?U\d{8}$/.test(str),
  BE: (str) => /^(BE)?\d{10}$/.test(str),
  BG: (str) => /^(BG)?\d{9,10}$/.test(str),
  HR: (str) => /^(HR)?\d{11}$/.test(str),
  CY: (str) => /^(CY)?\w{9}$/.test(str),
  CZ: (str) => /^(CZ)?\d{8,10}$/.test(str),
  DK: (str) => /^(DK)?\d{8}$/.test(str),
  EE: (str) => /^(EE)?\d{9}$/.test(str),
  FI: (str) => /^(FI)?\d{8}$/.test(str),
  FR: (str) => /^(FR)?\w{2}\d{9}$/.test(str),
  DE: (str) => /^(DE)?\d{9}$/.test(str),
  EL: (str) => /^(EL)?\d{9}$/.test(str),
  HU: (str) => /^(HU)?\d{8}$/.test(str),
  IE: (str) => /^(IE)?\d{7}\w{1}(W)?$/.test(str),
  IT: (str) => /^(IT)?\d{11}$/.test(str),
  LV: (str) => /^(LV)?\d{11}$/.test(str),
  LT: (str) => /^(LT)?\d{9,12}$/.test(str),
  LU: (str) => /^(LU)?\d{8}$/.test(str),
  MT: (str) => /^(MT)?\d{8}$/.test(str),
  NL: (str) => /^(NL)?\d{9}B\d{2}$/.test(str),
  PL: (str) => /^(PL)?(\d{10}|(\d{3}-\d{3}-\d{2}-\d{2})|(\d{3}-\d{2}-\d{2}-\d{3}))$/.test(str),
  PT,
  RO: (str) => /^(RO)?\d{2,10}$/.test(str),
  SK: (str) => /^(SK)?\d{10}$/.test(str),
  SI: (str) => /^(SI)?\d{8}$/.test(str),
  ES: (str) => /^(ES)?\w\d{7}[A-Z]$/.test(str),
  SE: (str) => /^(SE)?\d{12}$/.test(str),

  /**
   * VAT numbers of non-EU countries
   */
  AL: (str) => /^(AL)?\w{9}[A-Z]$/.test(str),
  MK: (str) => /^(MK)?\d{13}$/.test(str),
  AU,
  BY: (str) => /^(УНП )?\d{9}$/.test(str),
  CA: (str) => /^(CA)?\d{9}$/.test(str),
  IS: (str) => /^(IS)?\d{5,6}$/.test(str),
  IN: (str) => /^(IN)?\d{15}$/.test(str),
  ID: (str) => /^(ID)?(\d{15}|(\d{2}.\d{3}.\d{3}.\d{1}-\d{3}.\d{3}))$/.test(str),
  IL: (str) => /^(IL)?\d{9}$/.test(str),
  KZ: (str) => /^(KZ)?\d{12}$/.test(str),
  NZ: (str) => /^(NZ)?\d{9}$/.test(str),
  NG: (str) => /^(NG)?(\d{12}|(\d{8}-\d{4}))$/.test(str),
  NO: (str) => /^(NO)?\d{9}MVA$/.test(str),
  PH: (str) => /^(PH)?(\d{12}|\d{3} \d{3} \d{3} \d{3})$/.test(str),
  RU: (str) => /^(RU)?(\d{10}|\d{12})$/.test(str),
  SM: (str) => /^(SM)?\d{5}$/.test(str),
  SA: (str) => /^(SA)?\d{15}$/.test(str),
  RS: (str) => /^(RS)?\d{9}$/.test(str),
  CH,
  TR: (str) => /^(TR)?\d{10}$/.test(str),
  UA: (str) => /^(UA)?\d{12}$/.test(str),
  GB: (str) => /^GB((\d{3} \d{4} ([0-8][0-9]|9[0-6]))|(\d{9} \d{3})|(((GD[0-4])|(HA[5-9]))[0-9]{2}))$/.test(str),
  UZ: (str) => /^(UZ)?\d{9}$/.test(str),

  /**
   * VAT numbers of Latin American countries
   */
  AR: (str) => /^(AR)?\d{11}$/.test(str),
  BO: (str) => /^(BO)?\d{7}$/.test(str),
  BR: (str) => /^(BR)?((\d{2}.\d{3}.\d{3}\/\d{4}-\d{2})|(\d{3}.\d{3}.\d{3}-\d{2}))$/.test(str),
  CL: (str) => /^(CL)?\d{8}-\d{1}$/.test(str),
  CO: (str) => /^(CO)?\d{10}$/.test(str),
  CR: (str) => /^(CR)?\d{9,12}$/.test(str),
  EC: (str) => /^(EC)?\d{13}$/.test(str),
  SV: (str) => /^(SV)?\d{4}-\d{6}-\d{3}-\d{1}$/.test(str),
  GT: (str) => /^(GT)?\d{7}-\d{1}$/.test(str),
  HN: (str) => /^(HN)?$/.test(str),
  MX: (str) => /^(MX)?\w{3,4}\d{6}\w{3}$/.test(str),
  NI: (str) => /^(NI)?\d{3}-\d{6}-\d{4}\w{1}$/.test(str),
  PA: (str) => /^(PA)?$/.test(str),
  PY: (str) => /^(PY)?\d{6,8}-\d{1}$/.test(str),
  PE: (str) => /^(PE)?\d{11}$/.test(str),
  DO: (str) => /^(DO)?(\d{11}|(\d{3}-\d{7}-\d{1})|[1,4,5]{1}\d{8}|([1,4,5]{1})-\d{2}-\d{5}-\d{1})$/.test(str),
  UY: (str) => /^(UY)?\d{12}$/.test(str),
  VE: (str) => /^(VE)?[J,G,V,E]{1}-(\d{9}|(\d{8}-\d{1}))$/.test(str),
};

export default function isVAT(str, countryCode) {
  assertString(str);
  assertString(countryCode);

  if (countryCode in vatMatchers) {
    return vatMatchers[countryCode](str);
  }
  throw new Error(`Invalid country code: '${countryCode}'`);
}
