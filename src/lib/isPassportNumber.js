import assertString from './util/assertString';

/**
 * Reference:
 * https://en.wikipedia.org/ -- Wikipedia
 * https://docs.microsoft.com/en-us/microsoft-365/compliance/eu-passport-number -- EU Passport Number
 * https://countrycode.org/ -- Country Codes
 */
const passportRegexByCountryCode = {
  AM: /^[A-Z]{2}\d{7}$/, // ARMENIA
  AR: /^[A-Z]{3}\d{6}$/, // ARGENTINA
  AT: /^[A-Z]\d{7}$/, // AUSTRIA
  AU: /^[A-Z]\d{7}$/, // AUSTRALIA
  BE: /^[A-Z]{2}\d{6}$/, // BELGIUM
  BG: /^\d{9}$/, // BULGARIA
  BY: /^[A-Z]{2}\d{7}$/, // BELARUS
  CA: /^[A-Z]{2}\d{6}$/, // CANADA
  CH: /^[A-Z]\d{7}$/, // SWITZERLAND
  CN: /^[GE]\d{8}$/, // CHINA [G=Ordinary, E=Electronic] followed by 8-digits
  CY: /^[A-Z](\d{6}|\d{8})$/, // CYPRUS
  CZ: /^\d{8}$/, // CZECH REPUBLIC
  DE: /^[CFGHJKLMNPRTVWXYZ0-9]{9}$/, // GERMANY
  DK: /^\d{9}$/, // DENMARK
  DZ: /^\d{9}$/, // ALGERIA
  EE: /^([A-Z]\d{7}|[A-Z]{2}\d{7})$/, // ESTONIA (K followed by 7-digits), e-passports have 2 UPPERCASE followed by 7 digits
  ES: /^[A-Z0-9]{2}([A-Z0-9]?)\d{6}$/, // SPAIN
  FI: /^[A-Z]{2}\d{7}$/, // FINLAND
  FR: /^\d{2}[A-Z]{2}\d{5}$/, // FRANCE
  GB: /^\d{9}$/, // UNITED KINGDOM
  GR: /^[A-Z]{2}\d{7}$/, // GREECE
  HR: /^\d{9}$/, // CROATIA
  HU: /^[A-Z]{2}(\d{6}|\d{7})$/, // HUNGARY
  IE: /^[A-Z0-9]{2}\d{7}$/, // IRELAND
  IN: /^[A-Z]{1}-?\d{7}$/, // INDIA
  IS: /^(A)\d{7}$/, // ICELAND
  IT: /^[A-Z0-9]{2}\d{7}$/, // ITALY
  JM: /^[Aa]\d{7}$/, // JAMAICA
  JP: /^[A-Z]{2}\d{7}$/, // JAPAN
  KR: /^[MS]\d{8}$/, // SOUTH KOREA, REPUBLIC OF KOREA, [S=PS Passports, M=PM Passports]
  KZ: /^[a-zA-Z]\d{7}$/, // KAZAKHSTAN
  LT: /^[A-Z0-9]{8}$/, // LITHUANIA
  LI: /^[a-zA-Z]\d{5}$/, // LIECHTENSTEIN
  LU: /^[A-Z0-9]{8}$/, // LUXEMBURG
  LV: /^[A-Z0-9]{2}\d{7}$/, // LATVIA
  MY: /^[AaHhKk]\d{8}$/, // MALAYSIA
  MT: /^\d{7}$/, // MALTA
  MX: /(^[Gg]\d{8}$|^[0][8]\d{9}$|^[8]\d{9}$)/, // MEXICO
  NL: /^[A-Z]{2}[A-Z0-9]{6}\d$/, // NETHERLANDS
  NZ: /^([Ll]([Aa]|[Dd]|[Ff]|[Hh])|[Ee]([Aa]|[Pp])|[Nn])\d{6}$/, // NEW ZELAND
  PO: /^[A-Z]{2}\d{7}$/, // POLAND
  PT: /^[A-Z]\d{6}$/, // PORTUGAL
  RO: /^\d{8,9}$/, // ROMANIA
  RU: /^\d{2}\d{2}\d{6}$/, // RUSSIAN FEDERATION
  SE: /^\d{8}$/, // SWEDEN
  SL: /^(P)[A-Z]\d{7}$/, // SLOVENIA
  SK: /^[0-9A-Z]\d{7}$/, // SLOVAKIA
  TR: /^[A-Z]\d{8}$/, // TURKEY
  TH: /(^[a-zA-Z]\d{7}$|^[a-zA-Z]{2}\d{7}$|^[a-zA-Z]\d{6}$)/, // THAILAND
  UA: /^[A-Z]{2}\d{6}$/, // UKRAINE
  US: /^\d{9}$/, // UNITED STATES
};

/**
 * Check if str is a valid passport number
 * relative to provided ISO Country Code.
 *
 * @param {string} str
 * @param {string} countryCode
 * @return {boolean}
 */
export default function isPassportNumber(str, countryCode) {
  assertString(str);
  /** Remove All Whitespaces, Convert to UPPERCASE */
  const normalizedStr = str.replace(/\s/g, '').toUpperCase();

  return (countryCode.toUpperCase() in passportRegexByCountryCode) &&
    passportRegexByCountryCode[countryCode].test(normalizedStr);
}
