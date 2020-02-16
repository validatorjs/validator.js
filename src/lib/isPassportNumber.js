/**
 * Reference:
 * https://en.wikipedia.org/ -- Wikipedia
 * https://docs.microsoft.com/en-us/microsoft-365/compliance/eu-passport-number -- EU Passport Number
 * https://countrycode.org/ -- Country Codes
 */
const passportRegexByCountryCode = {
  AM: /^[a-zA-Z]{2}\d{7}$/, // ARMENIA
  AR: /^[a-zA-Z]{3}\d{6}$/, // ARGENTINA
  AT: /^[a-zA-Z](\s?)\d{7}$/, // AUSTRIA
  AU: /^[a-zA-Z]\d{7}$/, // AUSTRALIA
  BE: /^[a-zA-Z]{2}\d{6}$/, // BELGIUM
  BG: /^\d{9}$/, // BULGARIA
  CA: /^[a-zA-Z]{2}\d{6}$/, // CANADA
  CH: /^[a-zA-Z]\d{7}$/, // SWITZERLAND
  CN: /^[GE]\d{8}$/, // CHINA [G=Ordinary, E=Electronic] followed by 8-digits
  CY: /^[a-zA-Z](\d{6}|\d{8})$/, // CYPRUS
  CZ: /^\d{8}$/, // CZECH REPUBLIC
  DE: /^[CFGHJKLMNPRTVWXYZ0-9]{9}$/, // GERMANY
  DK: /^\d{9}$/, // DENMARK
  EE: /^([a-zA-Z]\d{7}|[A-Z]{2}\d{7})$/, // ESTONIA (K followed by 7-digits), e-passports have 2 UPPERCASE followed by 7 digits
  ES: /^[a-zA-Z0-9]{2}([a-zA-Z0-9]?)\d{6}$/, // SPAIN
  FI: /^[a-zA-Z]{2}\d{7}$/, // FINLAND
  FR: /^\d{2}[a-zA-Z]{2}\d{5}$/, // FRANCE
  GB: /^\d{9}$/, // UNITED KINGDOM
  GR: /^[a-zA-Z]{2}\d{7}$/, // GREECE
  HR: /^\d{9}$/, // CROATIA
  HU: /^[a-zA-Z]{2}(\d{6}|\d{7})$/, // HUNGARY
  IE: /^[a-zA-Z0-9]{2}\d{7}$/, // IRELAND
  IS: /^(A)\d{7}$/, // ICELAND
  IT: /^[a-zA-Z0-9]{2}\d{7}$/, // ITALY
  JP: /^[a-zA-Z]{2}\d{7}$/, // JAPAN
  KR: /^[MS]\d{8}$/, // SOUTH KOREA, REPUBLIC OF KOREA, [S=PS Passports, M=PM Passports]
  LT: /^[a-zA-Z0-9]{8}$/, // LITHUANIA
  LU: /^[a-zA-Z0-9]{8}$/, // LUXEMBURG
  LV: /^[a-zA-Z0-9]{2}\d{7}$/, // LATVIA
  MT: /^\d{7}$/, // MALTA
  NL: /^[a-zA-Z]{2}[a-zA-Z0-9]{6}\d$/, // NETHERLANDS
  PO: /^[a-zA-Z]{2}(\s?)\d{7}$/, // POLAND
  PT: /^[a-zA-Z]\d{6}$/, // PORTUGAL
  RO: /^\d{8,9}$/, // ROMANIA
  SE: /^\d{8}$/, // SWEDEN
  SL: /^(P)[a-zA-Z]\d{7}$/, // SLOVANIA
  SK: /^[0-9a-zA-Z]\d{7}$/, // SLOVAKIA
  TR: /^[a-zA-Z](\s?)\d{8}$/, // TURKEY
  UA: /^[a-zA-Z]{2}\d{6}$/, // UKRAINE
  US: /^\d{9}$/, // UNITED STATES
};

/**
 * Check if str is a valid passport number
 * relative to provided country code.
 *
 * @param {string} str
 * @param {string} countryCode
 * @return {boolean}
 */
export default function isPassportNumber(str, countryCode) {
  return (countryCode.toUpperCase() in passportRegexByCountryCode) &&
    passportRegexByCountryCode[countryCode].test(str);
}
