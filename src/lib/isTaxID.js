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

/*
 * de-AT validation function
 * (Abgabenkontonummer, persons/entities)
 * Verify TIN validity by calculating check (last) digit
 */
function deAtCheck(tin) {
  // split digits into an array for further processing
  const digits = tin.split('').map(a => parseInt(a, 10));

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
  return (100 - checksum) % 10 === digits[8];
}

/*
 * de-DE validation function
 * (Steueridentifikationsnummer (Steuer-IdNr.), persons only)
 * Tests for single duplicate/triplicate value, then calculates check (last) digit
 * Partial implementation of spec (not tested with checkvalue starting at 10, no point)
 */
function deDeCheck(tin) {
  // Split digits into an array for further processing
  const digits = tin.split('').map(a => parseInt(a, 10));

  // Fill array with strings of number positions
  let occurences = [];
  for (let i = 0; i < digits.length - 1; i++) {
    occurences.push('');
    for (let j = 0; j < digits.length - 1; j++) {
      if (digits[i] === digits[j]) {
        occurences[i] += j;
      }
    }
  }

  // Remove digits with one occurence and test for only one duplicate/triplicate
  occurences = occurences.filter(a => a.length > 1);
  if (occurences.length !== 2 && occurences.length !== 3) { return false; }

  // In case of triplicate value only two digits are allowed next to each other
  if (occurences[0].length === 3) {
    const trip_locations = occurences[0].split('').map(a => parseInt(a, 10));
    let recurrent = 0; // Amount of neighbour occurences
    for (let i = 0; i < trip_locations.length - 1; i++) {
      if (trip_locations[i] + 1 === trip_locations[i + 1]) {
        recurrent += 1;
      }
    }
    if (recurrent === 2) {
      return false;
    }
  }

  // Calculate check digit
  let checkvalue = 0;
  for (let i = 0; i < digits.length - 1; i++) {
    checkvalue = (digits[i] + checkvalue) % 10 === 0 ? (10 * 2) % 11 :
      (((digits[i] + checkvalue) % 10) * 2) % 11;
  }
  checkvalue = 11 - checkvalue === 10 ? 0 : 11 - checkvalue;

  return checkvalue === digits[10];
}

/*
 * el-CY validation function
 * (Arithmos Forologikou Mitroou (AFM/ΑΦΜ), persons only)
 * Verify TIN validity by calculating ASCII value of check (last) character
 */
function elCyCheck(tin) {
  // split digits into an array for further processing
  const digits = tin.slice(0, 8).split('').map(a => parseInt(a, 10));

  let checksum = 0;
  // add digits in even places
  for (let i = 1; i < digits.length; i += 2) {
    checksum += digits[i];
  }

  // add digits in odd places
  for (let i = 0; i < digits.length; i += 2) {
    if (digits[i] < 2) {
      checksum += 1 - digits[i];
    } else {
      checksum += (2 * (digits[i] - 2)) + 5;
      if (digits[i] > 4) {
        checksum += 2;
      }
    }
  }
  return String.fromCharCode((checksum % 26) + 65) === tin.charAt(8);
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
  return checksum % 11 === digits[8];
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
  return checksum === checkdigits;
}

/*
 * hu-HU validation function
 * (Adóazonosító jel, persons only)
 * Verify TIN validity by calculating check (last) digit
 */
function huHuCheck(tin) {
  // split digits into an array for further processing
  const digits = tin.split('').map(a => parseInt(a, 10));

  let checksum = 8;
  for (let i = 1; i < 9; i++) {
    checksum += digits[i] * (i + 1);
  }
  return checksum % 11 === digits[9];
}

// tax id regex formats for various locales
const taxIdFormat = {

  'de-AT': /^\d{9}$/,
  'de-DE': /^[1-9]\d{10}$/,
  'el-CY': /^[09]\d{7}[A-Z]$/,
  'el-GR': /^\d{9}$/,
  'en-GB': /^\d{10}$|^(?!GB|NK|TN|ZZ)(?![DFIQUV])[A-Z](?![DFIQUVO])[A-Z]\d{6}[ABCD ]$/i,
  'en-US': /^\d{2}[- ]{0,1}\d{7}$/,
  'fr-BE': /^\d{11}$/,
  'fr-FR': /^[0-3]\d{12}$|^[0-3]\d\s\d{2}(\s\d{3}){3}$/, // Conforms both with official spec and provided example
  'hu-HU': /^8\d{9}$/,

};

// taxIdFormat locale aliases
taxIdFormat['nl-BE'] = taxIdFormat['fr-BE'];

// Regexes for locales where characters should be omitted before checking format
const allsymbols = /[-\\\/!@#$%\^&\*\(\)\+\=\[\]]+/g;
const sanitizeRegexes = {
  'de-AT': allsymbols,
  'de-DE': /[\/\\]/g,
  'fr-BE': allsymbols,
};
// sanitizeRegexes locale aliases
sanitizeRegexes['nl-BE'] = sanitizeRegexes['fr-BE'];

// Algorithmic tax id check functions for various locales
const taxIdCheck = {

  'de-AT': deAtCheck,
  'de-DE': deDeCheck,
  'el-CY': elCyCheck,
  'el-GR': elGrCheck,
  'en-US': enUsCheck,
  'fr-BE': frBeCheck,
  'fr-FR': frFrCheck,
  'hu-HU': huHuCheck,

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
    if (locale in sanitizeRegexes) {
      strcopy = strcopy.replace(sanitizeRegexes[locale], '');
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
