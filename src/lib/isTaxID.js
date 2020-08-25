import assertString from './util/assertString';

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
 * Verify TIN validity by calculating check digit
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

  checksum = 100 - checksum;
  if (checksum % 10 === digits[8]) {
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

// tax id regex formats for various locales
const taxIdFormat = {

  'de-AT': /^\d{2}[-]{0,1}\d{3}[\/]{0,1}\d{4}$/,
  'en-US': /^\d{2}[- ]{0,1}\d{7}$/,

};


// Algorithmic tax id check functions for various locales
const taxIdCheck = {

  'de-AT': deAtCheck,
  'en-US': enUsCheck,

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
