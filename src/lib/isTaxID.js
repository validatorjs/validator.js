import assertString from './util/assertString';
import isDate from './isDate';

/**
 * TIN Validation
 * Validates Tax Identification Numbers (TINs) from the US, EU member states and the United Kingdom.
 *
 * EU-UK:
 * National TIN validity is calculated using public algorithms as made available by DG TAXUD.
 *
 * See `https://ec.europa.eu/taxation_customs/tin/specs/FS-TIN%20Algorithms-Public.docx` for more information.
 *
 * US:
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

// List of locales whence TINs should be sanitized (remove all special characters)
const sanitizeBeforeChecks = ['de-AT', 'fr-BE', 'nl-BE'];

/*
 * de-AT validation function
 * (Abgabenkontonummer, persons/entities)
 * Verify TIN validity by calculating check (last) digit
 */
function deAtCheck(tin) {
  // split digits into an array for further processing
  const digits = tin.replace(/\D/g, '').split('').map(a => parseInt(a, 10));

  let checksum = 0;
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      checksum += digits[i];
    } else {
      const product = digits[i] * 2;
      if (product > 9) {
        // sum digits of product and add to checksum
        checksum += product.toString().split('').map(a => parseInt(a, 10)).reduce((a, b) => a + b, 0);
      } else {
        checksum += product;
      }
    }
  }

  checksum = (100 - checksum) % 10;
  if (checksum === digits[8]) {
    return true;
  }
  return false;
}

/*
 * el-GR validation function
 * (Arithmos Forologikou Mitroou (AFM/ΑΦΜ), persons/entities)
 * Verify TIN validity by calculating check (last) digit
 * Algorithm not in DG TAXUD document- sourced from:
 * `http://epixeirisi.gr/%CE%9A%CE%A1%CE%99%CE%A3%CE%99%CE%9C%CE%91-%CE%98%CE%95%CE%9C%CE%91%CE%A4%CE%91-%CE%A6%CE%9F%CE%A1%CE%9F%CE%9B%CE%9F%CE%93%CE%99%CE%91%CE%A3-%CE%9A%CE%91%CE%99-%CE%9B%CE%9F%CE%93%CE%99%CE%A3%CE%A4%CE%99%CE%9A%CE%97%CE%A3/23791/%CE%91%CF%81%CE%B9%CE%B8%CE%BC%CF%8C%CF%82-%CE%A6%CE%BF%CF%81%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CE%BA%CE%BF%CF%8D-%CE%9C%CE%B7%CF%84%CF%81%CF%8E%CE%BF%CF%85`
 */
function elGrCheck(tin) {
  // split digits into an array for further processing
  const digits = tin.split('').map(a => parseInt(a, 10));

  let checksum = 0;
  for (let i = 0; i < 8; i++) {
    checksum += digits[i] * (2 ** (8 - i));
  }

  if (checksum % 11 === digits[8]) {
    return true;
  }
  return false;
}

/*
 * en-US validation function
 * Verify that the TIN starts with a valid IRS campus prefix
 */
function enUsCheck(tin) {
  return enUsGetPrefixes().indexOf(tin.substr(0, 2)) !== -1;
}

/*
 * fr/nl-BE validation function
 * (Numéro national (N.N.), persons only)
 * Checks if birth date (first six digits) is valid and calculates check (last two) digits
 */
function frBeCheck(tin) {
  // Zero month/day value is acceptable
  if (tin.slice(2, 4) !== '00' || tin.slice(4, 6) !== '00') {
    // Extract date from first six digits of TIN
    const date = `${tin.slice(0, 2)}/${tin.slice(2, 4)}/${tin.slice(4, 6)}`;
    if (!isDate(date, 'YY/MM/DD')) {
      return false;
    }
  }

  let checksum = 97 - (parseInt(tin.slice(0, 9), 10) % 97);
  const checkdigits = parseInt(tin.slice(9, 11), 10);
  if (checksum !== checkdigits) {
    checksum = 97 - (parseInt(`2${tin.slice(0, 9)}`, 10) % 97);
    if (checksum !== checkdigits) {
      return false;
    }
  }
  return true;
}

/*
 * fr-FR validation function
 * (Numéro fiscal de référence (numéro SPI), persons only)
 * Verify TIN validity by calculating check (last three) digits
 */
function frFrCheck(tin) {
  tin = tin.replace(/\s/g, '');
  const checksum = parseInt(tin.slice(0, 10), 10) % 511;
  const checkdigits = parseInt(tin.slice(10, 13), 10);
  if (checksum === checkdigits) {
    return true;
  }
  return false;
}

// tax id regex formats for various locales
const taxIdFormat = {

  'de-AT': /^\d{9}$/,
  'el-GR': /^\d{9}$/,
  'en-GB': /^\d{10}$|^(?!GB|NK|TN|ZZ)(?![DFIQUV])[A-Z](?![DFIQUVO])[A-Z]\d{6}[ABCD ]$/i,
  'en-US': /^\d{2}[- ]{0,1}\d{7}$/,
  'fr-BE': /^\d{11}$/,
  'fr-FR': /^[0-3]\d{12}$|^[0-3]\d\s\d{2}(\s\d{3}){3}$/, // Conforms both with official spec and provided example

};

// taxIdFormat locale aliases
taxIdFormat['nl-BE'] = taxIdFormat['fr-BE'];

// Algorithmic tax id check functions for various locales
const taxIdCheck = {

  'de-AT': deAtCheck,
  'el-GR': elGrCheck,
  'en-US': enUsCheck,
  'fr-BE': frBeCheck,
  'fr-FR': frFrCheck,

};

// taxIdCheck locale aliases
taxIdCheck['nl-BE'] = taxIdCheck['fr-BE'];

/*
 * Validator function
 * Return true if the passed string is a valid tax identification number
 * for the specified locale.
 * Throw an error exception if the locale is not supported.
 */
export default function isTaxID(str, locale = 'en-US') {
  assertString(str);
  // Copy TIN to avoid mutation if sanitized
  let strcopy = str.slice(0);

  if (locale in taxIdFormat) {
    if (sanitizeBeforeChecks.includes(locale)) {
      strcopy = strcopy.replace(/[-\\\/!@#$%\^&\*\(\)\+\=\[\]]+/g, '');
    }
    if (!taxIdFormat[locale].test(strcopy)) {
      return false;
    }

    if (locale in taxIdCheck) {
      return taxIdCheck[locale](strcopy);
    }
    // Fallthrough; not all locales have algorithmic checks
    return true;
  }
  throw new Error(`Invalid locale '${locale}'`);
}
