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
 * ISO 7064 validation function
 * Called with an array of single-digit integers by locale-specific functions
 * to validate TINs according to ISO 7064 (MOD 11, 10).
 */
function iso7064Check(digits) {
  let checkvalue = 10;
  for (let i = 0; i < digits.length - 1; i++) {
    checkvalue = (digits[i] + checkvalue) % 10 === 0 ? (10 * 2) % 11 :
      (((digits[i] + checkvalue) % 10) * 2) % 11;
  }
  checkvalue = checkvalue === 1 ? 0 : 11 - checkvalue;
  return checkvalue === digits[10];
}

/*
 * bg-BG validation function
 * (Edinen graždanski nomer (EGN/ЕГН), persons only)
 * Checks if birth date (first six digits) is valid and calculates check (last) digit
 */
function bgBgCheck(tin) {
  // Extract full year, normalize month and check birth date validity
  let century_year = parseInt(tin.slice(0, 2), 10);
  if (century_year < 10) { century_year = `0${century_year}`; }
  let month = parseInt(tin.slice(2, 4), 10);
  if (month > 40) {
    month -= 40;
    century_year = `20${century_year}`;
  } else if (month > 20) {
    month -= 20;
    century_year = `18${century_year}`;
  } else {
    century_year = `19${century_year}`;
  }
  if (month < 10) { month = `0${month}`; }
  const date = `${century_year}/${month}/${tin.slice(4, 6)}`;
  if (!isDate(date, 'YYYY/MM/DD')) { return false; }

  // split digits into an array for further processing
  const digits = tin.split('').map(a => parseInt(a, 10));

  // Calculate checksum by multiplying digits with fixed values
  const multip_lookup = [2, 4, 8, 5, 10, 9, 7, 3, 6];
  let checksum = 0;
  for (let i = 0; i < multip_lookup.length; i++) {
    checksum += digits[i] * multip_lookup[i];
  }
  checksum = checksum % 11 === 10 ? 0 : checksum % 11;
  return checksum === digits[9];
}

/*
 * cs-CZ validation function
 * (Rodné číslo (RČ), persons only)
 * Checks if birth date (first six digits) is valid and divisibility by 11
 * Material not in DG TAXUD document sourced from:
 * -`https://lorenc.info/3MA381/overeni-spravnosti-rodneho-cisla.htm`
 * -`https://www.mvcr.cz/clanek/rady-a-sluzby-dokumenty-rodne-cislo.aspx`
 */
function csCzCheck(tin) {
  tin = tin.replace(/\W/, '');

  // Extract full year from TIN length
  let full_year = parseInt(tin.slice(0, 2), 10);
  if (tin.length === 10) {
    if (full_year < 54) {
      full_year = `20${full_year}`;
    } else {
      full_year = `19${full_year}`;
    }
  } else {
    if (tin.slice(6) === '000') { return false; } // Three-zero serial not assigned before 1954
    if (full_year < 54) {
      full_year = `19${full_year}`;
    } else {
      return false; // No 18XX years seen in any of the resources
    }
  }
  // Add missing zero if needed
  if (full_year.length === 3) {
    full_year = [full_year.slice(0, 2), '0', full_year.slice(2)].join('');
  }

  // Extract month from TIN and normalize
  let month = parseInt(tin.slice(2, 4), 10);
  if (month > 50) {
    month -= 50;
  }
  if (month > 20) {
    // Month-plus-twenty was only introduced in 2004
    if (parseInt(full_year, 10) < 2004) { return false; }
    month -= 20;
  }
  if (month < 10) { month = `0${month}`; }

  // Check date validity
  const date = `${full_year}/${month}/${tin.slice(4, 6)}`;
  if (!isDate(date, 'YYYY/MM/DD')) { return false; }

  // Verify divisibility by 11
  if (tin.length === 10) {
    if (parseInt(tin, 10) % 11 !== 0) {
      // Some numbers up to and including 1985 are still valid if
      // check (last) digit equals 0 and modulo of first 9 digits equals 10
      const checkdigit = parseInt(tin.slice(0, 9), 10) % 11;
      if (parseInt(full_year, 10) < 1986 && checkdigit === 10) {
        if (parseInt(tin.slice(9), 10) !== 0) { return false; }
      } else {
        return false;
      }
    }
  }
  return true;
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
 * Tests for single duplicate/triplicate value, then calculates ISO 7064 check (last) digit
 * Partial implementation of spec (same result with both algorithms always)
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
  return iso7064Check(digits);
}

/*
 * dk-DK validation function
 * (CPR-nummer (personnummer), persons only)
 * Checks if birth date (first six digits) is valid and assigned to century (seventh) digit,
 * and calculates check (last) digit
 */
function dkDkCheck(tin) {
  tin = tin.replace(/\W/, '');

  // Extract year, check if valid for given century digit and add century
  let year = parseInt(tin.slice(4, 6), 10);
  const century_digit = tin.slice(6, 7);
  switch (century_digit) {
    case '0':
    case '1':
    case '2':
    case '3':
      year = `19${year}`;
      break;
    case '4':
    case '9':
      if (year < 37) {
        year = `20${year}`;
      } else {
        year = `19${year}`;
      }
      break;
    default:
      if (year < 37) {
        year = `20${year}`;
      } else if (year > 58) {
        year = `18${year}`;
      } else {
        return false;
      }
      break;
  }
  // Add missing zero if needed
  if (year.length === 3) {
    year = [year.slice(0, 2), '0', year.slice(2)].join('');
  }
  // Check date validity
  const date = `${year}/${tin.slice(2, 4)}/${tin.slice(0, 2)}`;
  if (!isDate(date, 'YYYY/MM/DD')) { return false; }

  // Split digits into an array for further processing
  const digits = tin.split('').map(a => parseInt(a, 10));
  let checksum = 0;
  let weight = 4;
  // Multiply by weight and add to checksum
  for (let i = 0; i < 9; i++) {
    checksum += digits[i] * weight;
    weight -= 1;
    if (weight === 1) {
      weight = 7;
    }
  }
  checksum %= 11;
  if (checksum === 1) { return false; }
  return checksum === 0 ? digits[9] === 0 : digits[9] === 11 - checksum;
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
 * - `http://epixeirisi.gr/%CE%9A%CE%A1%CE%99%CE%A3%CE%99%CE%9C%CE%91-%CE%98%CE%95%CE%9C%CE%91%CE%A4%CE%91-%CE%A6%CE%9F%CE%A1%CE%9F%CE%9B%CE%9F%CE%93%CE%99%CE%91%CE%A3-%CE%9A%CE%91%CE%99-%CE%9B%CE%9F%CE%93%CE%99%CE%A3%CE%A4%CE%99%CE%9A%CE%97%CE%A3/23791/%CE%91%CF%81%CE%B9%CE%B8%CE%BC%CF%8C%CF%82-%CE%A6%CE%BF%CF%81%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CE%BA%CE%BF%CF%8D-%CE%9C%CE%B7%CF%84%CF%81%CF%8E%CE%BF%CF%85`
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

/* en-GB validation function (should go here if needed)
 * (National Insurance Number (NINO) or Unique Taxpayer Reference (UTR),
 * persons/entities respectively)
 */

/*
 * en-US validation function
 * Verify that the TIN starts with a valid IRS campus prefix
 */
function enUsCheck(tin) {
  return enUsGetPrefixes().indexOf(tin.substr(0, 2)) !== -1;
}

/*
 * et-EE validation function
 * (Isikukood (IK), persons only)
 * Checks if birth date (century digit and six following) is valid and calculates check (last) digit
 * Material not in DG TAXUD document sourced from:
 * - `https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Estonia-TIN.pdf`
 */
function etEeCheck(tin) {
  // Extract year and add century
  let full_year = parseInt(tin.slice(1, 3), 10);
  const century_digit = tin.slice(0, 1);
  switch (century_digit) {
    case '1':
    case '2':
      full_year = `18${full_year}`;
      break;
    case '3':
    case '4':
      full_year = `19${full_year}`;
      break;
    default:
      full_year = `20${full_year}`;
      break;
  }
  // Add missing zero if needed
  if (full_year.length === 3) {
    full_year = [full_year.slice(0, 2), '0', full_year.slice(2)].join('');
  }
  // Check date validity
  const date = `${full_year}/${tin.slice(3, 5)}/${tin.slice(5, 7)}`;
  if (!isDate(date, 'YYYY/MM/DD')) { return false; }

  // Split digits into an array for further processing
  const digits = tin.split('').map(a => parseInt(a, 10));
  let checksum = 0;
  let weight = 1;
  // Multiply by weight and add to checksum
  for (let i = 0; i < 10; i++) {
    checksum += digits[i] * weight;
    weight += 1;
    if (weight === 10) {
      weight = 1;
    }
  }
  // Do again if modulo 11 of checksum is 10
  if (checksum % 11 === 10) {
    checksum = 0;
    weight = 3;
    for (let i = 0; i < 10; i++) {
      checksum += digits[i] * weight;
      weight += 1;
      if (weight === 10) {
        weight = 1;
      }
    }
    if (checksum % 11 === 10) { return digits[10] === 0; }
  }

  return checksum % 11 === digits[10];
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
    if (!isDate(date, 'YY/MM/DD')) { return false; }
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
 * hr-HR validation function
 * (Osobni identifikacijski broj (OIB), persons/entities)
 * Verify TIN validity by calling iso7064Check(digits)
 */
function hrHrCheck(tin) {
  // split digits into an array for further processing
  const digits = tin.split('').map(a => parseInt(a, 10));
  return iso7064Check(digits);
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

/*
 * sk-SK validation function
 * (Rodné číslo (RČ) or bezvýznamové identifikačné číslo (BIČ), persons only)
 * Checks validity of pre-1954 birth numbers (rodné číslo) only
 * Due to the introduction of the pseudo-random BIČ it is not possible to test
 * post-1954 birth numbers without knowing whether they are BIČ or RČ beforehand
 */
function skSkCheck(tin) {
  if (tin.length === 9) {
    tin = tin.replace(/\W/, '');
    if (tin.slice(6) === '000') { return false; } // Three-zero serial not assigned before 1954

    // Extract full year from TIN length
    let full_year = parseInt(tin.slice(0, 2), 10);
    if (full_year > 53) { return false; }
    if (full_year < 10) {
      full_year = `190${full_year}`;
    } else {
      full_year = `19${full_year}`;
    }

    // Extract month from TIN and normalize
    let month = parseInt(tin.slice(2, 4), 10);
    if (month > 50) {
      month -= 50;
    }
    if (month < 10) { month = `0${month}`; }

    // Check date validity
    const date = `${full_year}/${month}/${tin.slice(4, 6)}`;
    if (!isDate(date, 'YYYY/MM/DD')) { return false; }
  }
  return true;
}

// tax id regex formats for various locales
const taxIdFormat = {

  'bg-BG': /^\d{10}$/,
  'cs-CZ': /^\d{6}\/{0,1}\d{3,4}$/,
  'de-AT': /^\d{9}$/,
  'de-DE': /^[1-9]\d{10}$/,
  'dk-DK': /^\d{6}-{0,1}\d{4}$/,
  'el-CY': /^[09]\d{7}[A-Z]$/,
  'el-GR': /^([0-4]|[7-9])\d{8}$/,
  'en-GB': /^\d{10}$|^(?!GB|NK|TN|ZZ)(?![DFIQUV])[A-Z](?![DFIQUVO])[A-Z]\d{6}[ABCD ]$/i,
  'en-US': /^\d{2}[- ]{0,1}\d{7}$/,
  'et-EE': /^[1-6]\d{6}(00[1-9]|0[1-9][0-9]|[1-6][0-9]{2}|70[0-9]|710)\d$/,
  'fr-BE': /^\d{11}$/,
  'fr-FR': /^[0-3]\d{12}$|^[0-3]\d\s\d{2}(\s\d{3}){3}$/, // Conforms both with official spec and provided example
  'hr-HR': /^\d{11}$/,
  'hu-HU': /^8\d{9}$/,
  'sk-SK': /^\d{6}\/{0,1}\d{3,4}$/,

};

// taxIdFormat locale aliases
taxIdFormat['nl-BE'] = taxIdFormat['fr-BE'];

// Algorithmic tax id check functions for various locales
const taxIdCheck = {

  'bg-BG': bgBgCheck,
  'cs-CZ': csCzCheck,
  'de-AT': deAtCheck,
  'de-DE': deDeCheck,
  'dk-DK': dkDkCheck,
  'el-CY': elCyCheck,
  'el-GR': elGrCheck,
  'en-US': enUsCheck,
  'et-EE': etEeCheck,
  'fr-BE': frBeCheck,
  'fr-FR': frFrCheck,
  'hr-HR': hrHrCheck,
  'hu-HU': huHuCheck,
  'sk-SK': skSkCheck,

};

// taxIdCheck locale aliases
taxIdCheck['nl-BE'] = taxIdCheck['fr-BE'];

// Regexes for locales where characters should be omitted before checking format
const allsymbols = /[-\\\/!@#$%\^&\*\(\)\+\=\[\]]+/g;
const sanitizeRegexes = {
  'de-AT': allsymbols,
  'de-DE': /[\/\\]/g,
  'fr-BE': allsymbols,
};
// sanitizeRegexes locale aliases
sanitizeRegexes['nl-BE'] = sanitizeRegexes['fr-BE'];

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
