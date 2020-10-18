import assertString from './util/assertString';

/**
 * en-US TIN Validation
 *
 * An Employer Identification Number (EIN), also known as a Federal Tax Identification Number,
 *  is used to identify a business entity.
 *
 * NOTES:
 *  - Prefix 47 is being reserved for future use
 *  - Prefixes 26, 27, 45, 46 and 47 were previously assigned by the Philadelphia campus.
 *
 * See `http://www.irs.gov/Businesses/Small-Businesses-&-Self-Employed/How-EINs-are-Assigned-and-Valid-EIN-Prefixes`
 * for more information.
 */


// Valid US IRS campus prefixes
const enUsCampusPrefix = {
  andover: ['10', '12'],
  atlanta: ['60', '67'],
  austin: ['50', '53'],
  brookhaven: ['01', '02', '03', '04', '05', '06', '11', '13', '14', '16', '21', '22', '23', '25', '34', '51', '52', '54', '55', '56', '57', '58', '59', '65'],
  cincinnati: ['30', '32', '35', '36', '37', '38', '61'],
  fresno: ['15', '24'],
  internet: ['20', '26', '27', '45', '46', '47'],
  kansas: ['40', '44'],
  memphis: ['94', '95'],
  ogden: ['80', '90'],
  philadelphia: ['33', '39', '41', '42', '43', '46', '48', '62', '63', '64', '66', '68', '71', '72', '73', '74', '75', '76', '77', '81', '82', '83', '84', '85', '86', '87', '88', '91', '92', '93', '98', '99'],
  sba: ['31'],
};

// Return an array of all US IRS campus prefixes
function enUsGetPrefixes() {
  const prefixes = [];

  for (const location in enUsCampusPrefix) {
    // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
    // istanbul ignore else
    if (enUsCampusPrefix.hasOwnProperty(location)) {
      prefixes.push(...enUsCampusPrefix[location]);
    }
  }

  return prefixes;
}

/*
 * en-US validation function
 * Verify that the TIN starts with a valid IRS campus prefix
 */
function enUsCheck(tin) {
  return enUsGetPrefixes().indexOf(tin.substr(0, 2)) !== -1;
}

/*
 * de-DE validation function
 * Verify the checksum of the German TIN
 */
function deDeCheck(tin) {
  // TIN as number array without checksum
  const tinArray = tin
    .split('')
    .slice(0, 10)
    .map(char => parseInt(char, 10));
  // Rule 1: First digit must not be zero
  const firstDigitNotZero = parseInt(tin[0], 10) !== 0;
  // Rule 2a: Exactly one digit exists twice or thrice, the rest once or not at all
  const digitFreq = [...new Array(10).keys()].map(n => tinArray.filter(k => k === n).length);
  const validDigitDistribution = digitFreq.filter(n => n === 2 || n === 3).length === 1;
  console.log(digitFreq);
  // Rule 3: Checksum (11th digit can be calculated from the first 10 digits)
  const want = parseInt(tin[10], 10);
  const have = (11 - (tinArray
    .reduce((prev, curr) => {
      const lastDigitOfSum = (prev + curr) % 10;
      const z = lastDigitOfSum > 0 ? lastDigitOfSum : 10;
      return (z * 2) % 11;
    }, 10))) % 10;
  const checksumValid = want === have;
  // TIN is valid if all rules apply
  return firstDigitNotZero && validDigitDistribution && checksumValid;
}

// tax id regex formats for various locales
const taxIdFormat = {

  'en-US': /^\d{2}[- ]{0,1}\d{7}$/,
  'de-DE': /^[0-9]{11}$/,

};


// Algorithmic tax id check functions for various locales
const taxIdCheck = {

  'en-US': enUsCheck,
  'de-DE': deDeCheck,

};

/*
 * Validator function
 * Return true if the passed string is a valid tax identification number
 * for the specified locale.
 * Throw an error exception if the locale is not supported.
 */
export default function isTaxID(str, locale = 'en-US') {
  assertString(str);
  if (locale in taxIdFormat) {
    if (!taxIdFormat[locale].test(str)) {
      return false;
    }

    if (locale in taxIdCheck) {
      return taxIdCheck[locale](str);
    }
    // Fallthrough; not all locales have algorithmic checks
    return true;
  }
  throw new Error(`Invalid locale '${locale}'`);
}
