import assertString from './util/assertString';
import * as algorithms from './util/algorithms';
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

// Locale functions

/*
 * bg-BG validation function
 * (Edinen graždanski nomer (EGN/ЕГН), persons only)
 * Checks if birth date (first six digits) is valid and calculates check (last) digit
 */
function bgBgCheck(tin) {
  // Extract full year, normalize month and check birth date validity
  let century_year = tin.slice(0, 2);
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

/**
 * Check if an input is a valid Canadian SIN (Social Insurance Number)
 *
 * The Social Insurance Number (SIN) is a 9 digit number that
 * you need to work in Canada or to have access to government programs and benefits.
 *
 * https://en.wikipedia.org/wiki/Social_Insurance_Number
 * https://www.canada.ca/en/employment-social-development/services/sin.html
 * https://www.codercrunch.com/challenge/819302488/sin-validator
 *
 * @param {string} input
 * @return {boolean}
 */
function isCanadianSIN(input) {
  const digitsArray = input.split('');
  const even = digitsArray
    .filter((_, idx) => idx % 2)
    .map(i => Number(i) * 2)
    .join('')
    .split('');

  const total = digitsArray
    .filter((_, idx) => !(idx % 2))
    .concat(even)
    .map(i => Number(i))
    .reduce((acc, cur) => acc + cur);

  return (total % 10 === 0);
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
 * Verify TIN validity by calling luhnCheck()
 */
function deAtCheck(tin) {
  return algorithms.luhnCheck(tin);
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
  let occurrences = [];
  for (let i = 0; i < digits.length - 1; i++) {
    occurrences.push('');
    for (let j = 0; j < digits.length - 1; j++) {
      if (digits[i] === digits[j]) {
        occurrences[i] += j;
      }
    }
  }

  // Remove digits with one occurrence and test for only one duplicate/triplicate
  occurrences = occurrences.filter(a => a.length > 1);
  if (occurrences.length !== 2 && occurrences.length !== 3) { return false; }

  // In case of triplicate value only two digits are allowed next to each other
  if (occurrences[0].length === 3) {
    const trip_locations = occurrences[0].split('').map(a => parseInt(a, 10));
    let recurrent = 0; // Amount of neighbor occurrences
    for (let i = 0; i < trip_locations.length - 1; i++) {
      if (trip_locations[i] + 1 === trip_locations[i + 1]) {
        recurrent += 1;
      }
    }
    if (recurrent === 2) {
      return false;
    }
  }
  return algorithms.iso7064Check(tin);
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
  return ((checksum % 11) % 10) === digits[8];
}

/*
 * en-GB validation function (should go here if needed)
 * (National Insurance Number (NINO) or Unique Taxpayer Reference (UTR),
 * persons/entities respectively)
 */

/*
 * en-IE validation function
 * (Personal Public Service Number (PPS No), persons only)
 * Verify TIN validity by calculating check (second to last) character
 */
function enIeCheck(tin) {
  let checksum = algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 7).map(a => parseInt(a, 10)), 8);
  if (tin.length === 9 && tin[8] !== 'W') {
    checksum += (tin[8].charCodeAt(0) - 64) * 9;
  }

  checksum %= 23;
  if (checksum === 0) {
    return tin[7].toUpperCase() === 'W';
  }
  return tin[7].toUpperCase() === String.fromCharCode(64 + checksum);
}

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
  return enUsGetPrefixes().indexOf(tin.slice(0, 2)) !== -1;
}

/*
 * es-AR validation function
 * Clave Única de Identificación Tributaria (CUIT/CUIL)
 * Sourced from:
 * - https://servicioscf.afip.gob.ar/publico/abc/ABCpaso2.aspx?id_nivel1=3036&id_nivel2=3040&p=Conceptos%20b%C3%A1sicos
 * - https://es.wikipedia.org/wiki/Clave_%C3%9Anica_de_Identificaci%C3%B3n_Tributaria
 */

function esArCheck(tin) {
  let accum = 0;
  let digits = tin.split('');
  let digit = parseInt(digits.pop(), 10);
  for (let i = 0; i < digits.length; i++) {
    accum += digits[9 - i] * (2 + (i % 6));
  }
  let verif = 11 - (accum % 11);
  if (verif === 11) {
    verif = 0;
  } else if (verif === 10) {
    verif = 9;
  }
  return digit === verif;
}

/*
 * es-ES validation function
 * (Documento Nacional de Identidad (DNI)
 * or Número de Identificación de Extranjero (NIE), persons only)
 * Verify TIN validity by calculating check (last) character
 */
function esEsCheck(tin) {
  // Split characters into an array for further processing
  let chars = tin.toUpperCase().split('');

  // Replace initial letter if needed
  if (isNaN(parseInt(chars[0], 10)) && chars.length > 1) {
    let lead_replace = 0;
    switch (chars[0]) {
      case 'Y':
        lead_replace = 1;
        break;
      case 'Z':
        lead_replace = 2;
        break;
      default:
    }
    chars.splice(0, 1, lead_replace);
  // Fill with zeros if smaller than proper
  } else {
    while (chars.length < 9) {
      chars.unshift(0);
    }
  }

  // Calculate checksum and check according to lookup
  const lookup = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];
  chars = chars.join('');
  let checksum = (parseInt(chars.slice(0, 8), 10) % 23);
  return chars[8] === lookup[checksum];
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
  let full_year = tin.slice(1, 3);
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
 * fi-FI validation function
 * (Henkilötunnus (HETU), persons only)
 * Checks if birth date (first six digits plus century symbol) is valid
 * and calculates check (last) digit
 */
function fiFiCheck(tin) {
  // Extract year and add century
  let full_year = tin.slice(4, 6);
  const century_symbol = tin.slice(6, 7);
  switch (century_symbol) {
    case '+':
      full_year = `18${full_year}`;
      break;
    case '-':
      full_year = `19${full_year}`;
      break;
    default:
      full_year = `20${full_year}`;
      break;
  }
  // Check date validity
  const date = `${full_year}/${tin.slice(2, 4)}/${tin.slice(0, 2)}`;
  if (!isDate(date, 'YYYY/MM/DD')) { return false; }

  // Calculate check character
  let checksum = parseInt((tin.slice(0, 6) + tin.slice(7, 10)), 10) % 31;
  if (checksum < 10) { return checksum === parseInt(tin.slice(10), 10); }

  checksum -= 10;
  const letters_lookup = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];
  return letters_lookup[checksum] === tin.slice(10);
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
 * fr/lb-LU validation function
 * (numéro d’identification personnelle, persons only)
 * Verify birth date validity and run Luhn and Verhoeff checks
 */
function frLuCheck(tin) {
  // Extract date and check validity
  const date = `${tin.slice(0, 4)}/${tin.slice(4, 6)}/${tin.slice(6, 8)}`;
  if (!isDate(date, 'YYYY/MM/DD')) { return false; }

  // Run Luhn check
  if (!algorithms.luhnCheck(tin.slice(0, 12))) { return false; }
  // Remove Luhn check digit and run Verhoeff check
  return algorithms.verhoeffCheck(`${tin.slice(0, 11)}${tin[12]}`);
}

/*
 * hr-HR validation function
 * (Osobni identifikacijski broj (OIB), persons/entities)
 * Verify TIN validity by calling iso7064Check(digits)
 */
function hrHrCheck(tin) {
  return algorithms.iso7064Check(tin);
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
 * lt-LT validation function (should go here if needed)
 * (Asmens kodas, persons/entities respectively)
 * Current validation check is alias of etEeCheck- same format applies
 */

/*
 * it-IT first/last name validity check
 * Accepts it-IT TIN-encoded names as a three-element character array and checks their validity
 * Due to lack of clarity between resources ("Are only Italian consonants used?
 * What happens if a person has X in their name?" etc.) only two test conditions
 * have been implemented:
 * Vowels may only be followed by other vowels or an X character
 * and X characters after vowels may only be followed by other X characters.
 */
function itItNameCheck(name) {
  // true at the first occurrence of a vowel
  let vowelflag = false;

  // true at the first occurrence of an X AFTER vowel
  // (to properly handle last names with X as consonant)
  let xflag = false;

  for (let i = 0; i < 3; i++) {
    if (!vowelflag && /[AEIOU]/.test(name[i])) {
      vowelflag = true;
    } else if (!xflag && vowelflag && (name[i] === 'X')) {
      xflag = true;
    } else if (i > 0) {
      if (vowelflag && !xflag) {
        if (!/[AEIOU]/.test(name[i])) { return false; }
      }
      if (xflag) {
        if (!/X/.test(name[i])) { return false; }
      }
    }
  }
  return true;
}

/*
 * it-IT validation function
 * (Codice fiscale (TIN-IT), persons only)
 * Verify name, birth date and codice catastale validity
 * and calculate check character.
 * Material not in DG-TAXUD document sourced from:
 * `https://en.wikipedia.org/wiki/Italian_fiscal_code`
 */
function itItCheck(tin) {
  // Capitalize and split characters into an array for further processing
  const chars = tin.toUpperCase().split('');

  // Check first and last name validity calling itItNameCheck()
  if (!itItNameCheck(chars.slice(0, 3))) { return false; }
  if (!itItNameCheck(chars.slice(3, 6))) { return false; }

  // Convert letters in number spaces back to numbers if any
  const number_locations = [6, 7, 9, 10, 12, 13, 14];
  const number_replace = {
    L: '0',
    M: '1',
    N: '2',
    P: '3',
    Q: '4',
    R: '5',
    S: '6',
    T: '7',
    U: '8',
    V: '9',
  };
  for (const i of number_locations) {
    if (chars[i] in number_replace) {
      chars.splice(i, 1, number_replace[chars[i]]);
    }
  }

  // Extract month and day, and check date validity
  const month_replace = {
    A: '01',
    B: '02',
    C: '03',
    D: '04',
    E: '05',
    H: '06',
    L: '07',
    M: '08',
    P: '09',
    R: '10',
    S: '11',
    T: '12',
  };
  let month = month_replace[chars[8]];

  let day = parseInt(chars[9] + chars[10], 10);
  if (day > 40) { day -= 40; }
  if (day < 10) { day = `0${day}`; }

  const date = `${chars[6]}${chars[7]}/${month}/${day}`;
  if (!isDate(date, 'YY/MM/DD')) { return false; }

  // Calculate check character by adding up even and odd characters as numbers
  let checksum = 0;
  for (let i = 1; i < chars.length - 1; i += 2) {
    let char_to_int = parseInt(chars[i], 10);
    if (isNaN(char_to_int)) {
      char_to_int = chars[i].charCodeAt(0) - 65;
    }
    checksum += char_to_int;
  }

  const odd_convert = { // Maps of characters at odd places
    A: 1,
    B: 0,
    C: 5,
    D: 7,
    E: 9,
    F: 13,
    G: 15,
    H: 17,
    I: 19,
    J: 21,
    K: 2,
    L: 4,
    M: 18,
    N: 20,
    O: 11,
    P: 3,
    Q: 6,
    R: 8,
    S: 12,
    T: 14,
    U: 16,
    V: 10,
    W: 22,
    X: 25,
    Y: 24,
    Z: 23,
    0: 1,
    1: 0,
  };
  for (let i = 0; i < chars.length - 1; i += 2) {
    let char_to_int = 0;
    if (chars[i] in odd_convert) {
      char_to_int = odd_convert[chars[i]];
    } else {
      let multiplier = parseInt(chars[i], 10);
      char_to_int = (2 * multiplier) + 1;
      if (multiplier > 4) {
        char_to_int += 2;
      }
    }
    checksum += char_to_int;
  }

  if (String.fromCharCode(65 + (checksum % 26)) !== chars[15]) { return false; }
  return true;
}

/*
 * lv-LV validation function
 * (Personas kods (PK), persons only)
 * Check validity of birth date and calculate check (last) digit
 * Support only for old format numbers (not starting with '32', issued before 2017/07/01)
 * Material not in DG TAXUD document sourced from:
 * `https://boot.ritakafija.lv/forums/index.php?/topic/88314-personas-koda-algoritms-%C4%8Deksumma/`
 */
function lvLvCheck(tin) {
  tin = tin.replace(/\W/, '');
  // Extract date from TIN
  const day = tin.slice(0, 2);
  if (day !== '32') { // No date/checksum check if new format
    const month = tin.slice(2, 4);
    if (month !== '00') { // No date check if unknown month
      let full_year = tin.slice(4, 6);
      switch (tin[6]) {
        case '0':
          full_year = `18${full_year}`;
          break;
        case '1':
          full_year = `19${full_year}`;
          break;
        default:
          full_year = `20${full_year}`;
          break;
      }
      // Check date validity
      const date = `${full_year}/${tin.slice(2, 4)}/${day}`;
      if (!isDate(date, 'YYYY/MM/DD')) { return false; }
    }

    // Calculate check digit
    let checksum = 1101;
    const multip_lookup = [1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    for (let i = 0; i < tin.length - 1; i++) {
      checksum -= parseInt(tin[i], 10) * multip_lookup[i];
    }
    return (parseInt(tin[10], 10) === checksum % 11);
  }
  return true;
}

/*
 * mt-MT validation function
 * (Identity Card Number or Unique Taxpayer Reference, persons/entities)
 * Verify Identity Card Number structure (no other tests found)
 */
function mtMtCheck(tin) {
  if (tin.length !== 9) { // No tests for UTR
    let chars = tin.toUpperCase().split('');
    // Fill with zeros if smaller than proper
    while (chars.length < 8) {
      chars.unshift(0);
    }
    // Validate format according to last character
    switch (tin[7]) {
      case 'A':
      case 'P':
        if (parseInt(chars[6], 10) === 0) { return false; }
        break;
      default: {
        const first_part = parseInt(chars.join('').slice(0, 5), 10);
        if (first_part > 32000) { return false; }
        const second_part = parseInt(chars.join('').slice(5, 7), 10);
        if (first_part === second_part) { return false; }
      }
    }
  }
  return true;
}

/*
 * nl-NL validation function
 * (Burgerservicenummer (BSN) or Rechtspersonen Samenwerkingsverbanden Informatie Nummer (RSIN),
 * persons/entities respectively)
 * Verify TIN validity by calculating check (last) digit (variant of MOD 11)
 */
function nlNlCheck(tin) {
  return algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 8).map(a => parseInt(a, 10)), 9) % 11 === parseInt(tin[8], 10);
}

/*
 * pl-PL validation function
 * (Powszechny Elektroniczny System Ewidencji Ludności (PESEL)
 * or Numer identyfikacji podatkowej (NIP), persons/entities)
 * Verify TIN validity by validating birth date (PESEL) and calculating check (last) digit
 */
function plPlCheck(tin) {
  // NIP
  if (tin.length === 10) {
    // Calculate last digit by multiplying with lookup
    const lookup = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let checksum = 0;
    for (let i = 0; i < lookup.length; i++) {
      checksum += parseInt(tin[i], 10) * lookup[i];
    }
    checksum %= 11;
    if (checksum === 10) { return false; }
    return (checksum === parseInt(tin[9], 10));
  }

  // PESEL
  // Extract full year using month
  let full_year = tin.slice(0, 2);
  let month = parseInt(tin.slice(2, 4), 10);
  if (month > 80) {
    full_year = `18${full_year}`;
    month -= 80;
  } else if (month > 60) {
    full_year = `22${full_year}`;
    month -= 60;
  } else if (month > 40) {
    full_year = `21${full_year}`;
    month -= 40;
  } else if (month > 20) {
    full_year = `20${full_year}`;
    month -= 20;
  } else {
    full_year = `19${full_year}`;
  }
  // Add leading zero to month if needed
  if (month < 10) { month = `0${month}`; }
  // Check date validity
  const date = `${full_year}/${month}/${tin.slice(4, 6)}`;
  if (!isDate(date, 'YYYY/MM/DD')) { return false; }

  // Calculate last digit by multiplying with odd one-digit numbers except 5
  let checksum = 0;
  let multiplier = 1;
  for (let i = 0; i < tin.length - 1; i++) {
    checksum += (parseInt(tin[i], 10) * multiplier) % 10;
    multiplier += 2;
    if (multiplier > 10) {
      multiplier = 1;
    } else if (multiplier === 5) {
      multiplier += 2;
    }
  }
  checksum = 10 - (checksum % 10);
  return checksum === parseInt(tin[10], 10);
}

/*
* pt-BR validation function
* (Cadastro de Pessoas Físicas (CPF, persons)
* Cadastro Nacional de Pessoas Jurídicas (CNPJ, entities)
* Both inputs will be validated
*/

function ptBrCheck(tin) {
  if (tin.length === 11) {
    let sum;
    let remainder;
    sum = 0;

    if ( // Reject known invalid CPFs
      tin === '11111111111' ||
      tin === '22222222222' ||
      tin === '33333333333' ||
      tin === '44444444444' ||
      tin === '55555555555' ||
      tin === '66666666666' ||
      tin === '77777777777' ||
      tin === '88888888888' ||
      tin === '99999999999' ||
      tin === '00000000000'
    ) return false;

    for (let i = 1; i <= 9; i++) sum += parseInt(tin.substring(i - 1, i), 10) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(tin.substring(9, 10), 10)) return false;
    sum = 0;

    for (let i = 1; i <= 10; i++) sum += parseInt(tin.substring(i - 1, i), 10) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(tin.substring(10, 11), 10)) return false;

    return true;
  }

  if ( // Reject know invalid CNPJs
    tin === '00000000000000' ||
    tin === '11111111111111' ||
    tin === '22222222222222' ||
    tin === '33333333333333' ||
    tin === '44444444444444' ||
    tin === '55555555555555' ||
    tin === '66666666666666' ||
    tin === '77777777777777' ||
    tin === '88888888888888' ||
    tin === '99999999999999') { return false; }

  let length = tin.length - 2;
  let identifiers = tin.substring(0, length);
  let verificators = tin.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += identifiers.charAt(length - i) * pos;
    pos -= 1;
    if (pos < 2) { pos = 9; }
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(verificators.charAt(0), 10)) { return false; }

  length += 1;
  identifiers = tin.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += identifiers.charAt(length - i) * pos;
    pos -= 1;
    if (pos < 2) { pos = 9; }
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(verificators.charAt(1), 10)) { return false; }

  return true;
}

/*
 * pt-PT validation function
 * (Número de identificação fiscal (NIF), persons/entities)
 * Verify TIN validity by calculating check (last) digit (variant of MOD 11)
 */
function ptPtCheck(tin) {
  let checksum = 11 - (algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 8).map(a => parseInt(a, 10)), 9) % 11);
  if (checksum > 9) { return parseInt(tin[8], 10) === 0; }
  return checksum === parseInt(tin[8], 10);
}

/*
 * ro-RO validation function
 * (Cod Numeric Personal (CNP) or Cod de înregistrare fiscală (CIF),
 * persons only)
 * Verify CNP validity by calculating check (last) digit (test not found for CIF)
 * Material not in DG TAXUD document sourced from:
 * `https://en.wikipedia.org/wiki/National_identification_number#Romania`
 */
function roRoCheck(tin) {
  if (tin.slice(0, 4) !== '9000') { // No test found for this format
    // Extract full year using century digit if possible
    let full_year = tin.slice(1, 3);
    switch (tin[0]) {
      case '1':
      case '2':
        full_year = `19${full_year}`;
        break;
      case '3':
      case '4':
        full_year = `18${full_year}`;
        break;
      case '5':
      case '6':
        full_year = `20${full_year}`;
        break;
      default:
    }

    // Check date validity
    const date = `${full_year}/${tin.slice(3, 5)}/${tin.slice(5, 7)}`;
    if (date.length === 8) {
      if (!isDate(date, 'YY/MM/DD')) { return false; }
    } else if (!isDate(date, 'YYYY/MM/DD')) { return false; }

    // Calculate check digit
    const digits = tin.split('').map(a => parseInt(a, 10));
    const multipliers = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
    let checksum = 0;
    for (let i = 0; i < multipliers.length; i++) {
      checksum += digits[i] * multipliers[i];
    }
    if (checksum % 11 === 10) { return digits[12] === 1; }
    return digits[12] === checksum % 11;
  }
  return true;
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

/*
 * sl-SI validation function
 * (Davčna številka, persons/entities)
 * Verify TIN validity by calculating check (last) digit (variant of MOD 11)
 */
function slSiCheck(tin) {
  let checksum = 11 - (algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 7).map(a => parseInt(a, 10)), 8) % 11);
  if (checksum === 10) { return parseInt(tin[7], 10) === 0; }
  return checksum === parseInt(tin[7], 10);
}

/*
 * sv-SE validation function
 * (Personnummer or samordningsnummer, persons only)
 * Checks validity of birth date and calls luhnCheck() to validate check (last) digit
 */
function svSeCheck(tin) {
  // Make copy of TIN and normalize to two-digit year form
  let tin_copy = tin.slice(0);
  if (tin.length > 11) {
    tin_copy = tin_copy.slice(2);
  }

  // Extract date of birth
  let full_year = '';
  const month = tin_copy.slice(2, 4);
  let day = parseInt(tin_copy.slice(4, 6), 10);
  if (tin.length > 11) {
    full_year = tin.slice(0, 4);
  } else {
    full_year = tin.slice(0, 2);
    if (tin.length === 11 && day < 60) {
      // Extract full year from centenarian symbol
      // Should work just fine until year 10000 or so
      let current_year = new Date().getFullYear().toString();
      const current_century = parseInt(current_year.slice(0, 2), 10);
      current_year = parseInt(current_year, 10);
      if (tin[6] === '-') {
        if (parseInt(`${current_century}${full_year}`, 10) > current_year) {
          full_year = `${current_century - 1}${full_year}`;
        } else {
          full_year = `${current_century}${full_year}`;
        }
      } else {
        full_year = `${current_century - 1}${full_year}`;
        if (current_year - parseInt(full_year, 10) < 100) { return false; }
      }
    }
  }

  // Normalize day and check date validity
  if (day > 60) { day -= 60; }
  if (day < 10) { day = `0${day}`; }
  const date = `${full_year}/${month}/${day}`;
  if (date.length === 8) {
    if (!isDate(date, 'YY/MM/DD')) { return false; }
  } else if (!isDate(date, 'YYYY/MM/DD')) { return false; }

  return algorithms.luhnCheck(tin.replace(/\W/, ''));
}

/**
 * uk-UA validation function
 * Verify TIN validity by calculating check (last) digit (variant of MOD 11)
 */
function ukUaCheck(tin) {
  // Calculate check digit
  const digits = tin.split('').map(a => parseInt(a, 10));
  const multipliers = [-1, 5, 7, 9, 4, 6, 10, 5, 7];
  let checksum = 0;
  for (let i = 0; i < multipliers.length; i++) {
    checksum += digits[i] * multipliers[i];
  }
  return checksum % 11 === 10 ? digits[9] === 0 : digits[9] === checksum % 11;
}

// Locale lookup objects

/*
 * Tax id regex formats for various locales
 *
 * Where not explicitly specified in DG-TAXUD document both
 * uppercase and lowercase letters are acceptable.
 */
const taxIdFormat = {
  'bg-BG': /^\d{10}$/,
  'cs-CZ': /^\d{6}\/{0,1}\d{3,4}$/,
  'de-AT': /^\d{9}$/,
  'de-DE': /^[1-9]\d{10}$/,
  'dk-DK': /^\d{6}-{0,1}\d{4}$/,
  'el-CY': /^[09]\d{7}[A-Z]$/,
  'el-GR': /^([0-4]|[7-9])\d{8}$/,
  'en-CA': /^\d{9}$/,
  'en-GB': /^\d{10}$|^(?!GB|NK|TN|ZZ)(?![DFIQUV])[A-Z](?![DFIQUVO])[A-Z]\d{6}[ABCD ]$/i,
  'en-IE': /^\d{7}[A-W][A-IW]{0,1}$/i,
  'en-US': /^\d{2}[- ]{0,1}\d{7}$/,
  'es-AR': /(20|23|24|27|30|33|34)[0-9]{8}[0-9]/,
  'es-ES': /^(\d{0,8}|[XYZKLM]\d{7})[A-HJ-NP-TV-Z]$/i,
  'et-EE': /^[1-6]\d{6}(00[1-9]|0[1-9][0-9]|[1-6][0-9]{2}|70[0-9]|710)\d$/,
  'fi-FI': /^\d{6}[-+A]\d{3}[0-9A-FHJ-NPR-Y]$/i,
  'fr-BE': /^\d{11}$/,
  'fr-FR': /^[0-3]\d{12}$|^[0-3]\d\s\d{2}(\s\d{3}){3}$/, // Conforms both to official spec and provided example
  'fr-LU': /^\d{13}$/,
  'hr-HR': /^\d{11}$/,
  'hu-HU': /^8\d{9}$/,
  'it-IT': /^[A-Z]{6}[L-NP-V0-9]{2}[A-EHLMPRST][L-NP-V0-9]{2}[A-ILMZ][L-NP-V0-9]{3}[A-Z]$/i,
  'lv-LV': /^\d{6}-{0,1}\d{5}$/, // Conforms both to DG TAXUD spec and original research
  'mt-MT': /^\d{3,7}[APMGLHBZ]$|^([1-8])\1\d{7}$/i,
  'nl-NL': /^\d{9}$/,
  'pl-PL': /^\d{10,11}$/,
  'pt-BR': /(?:^\d{11}$)|(?:^\d{14}$)/,
  'pt-PT': /^\d{9}$/,
  'ro-RO': /^\d{13}$/,
  'sk-SK': /^\d{6}\/{0,1}\d{3,4}$/,
  'sl-SI': /^[1-9]\d{7}$/,
  'sv-SE': /^(\d{6}[-+]{0,1}\d{4}|(18|19|20)\d{6}[-+]{0,1}\d{4})$/,
  'uk-UA': /^\d{10}$/,
};
// taxIdFormat locale aliases
taxIdFormat['lb-LU'] = taxIdFormat['fr-LU'];
taxIdFormat['lt-LT'] = taxIdFormat['et-EE'];
taxIdFormat['nl-BE'] = taxIdFormat['fr-BE'];
taxIdFormat['fr-CA'] = taxIdFormat['en-CA'];

// Algorithmic tax id check functions for various locales
const taxIdCheck = {
  'bg-BG': bgBgCheck,
  'cs-CZ': csCzCheck,
  'de-AT': deAtCheck,
  'de-DE': deDeCheck,
  'dk-DK': dkDkCheck,
  'el-CY': elCyCheck,
  'el-GR': elGrCheck,
  'en-CA': isCanadianSIN,
  'en-IE': enIeCheck,
  'en-US': enUsCheck,
  'es-AR': esArCheck,
  'es-ES': esEsCheck,
  'et-EE': etEeCheck,
  'fi-FI': fiFiCheck,
  'fr-BE': frBeCheck,
  'fr-FR': frFrCheck,
  'fr-LU': frLuCheck,
  'hr-HR': hrHrCheck,
  'hu-HU': huHuCheck,
  'it-IT': itItCheck,
  'lv-LV': lvLvCheck,
  'mt-MT': mtMtCheck,
  'nl-NL': nlNlCheck,
  'pl-PL': plPlCheck,
  'pt-BR': ptBrCheck,
  'pt-PT': ptPtCheck,
  'ro-RO': roRoCheck,
  'sk-SK': skSkCheck,
  'sl-SI': slSiCheck,
  'sv-SE': svSeCheck,
  'uk-UA': ukUaCheck,
};
// taxIdCheck locale aliases
taxIdCheck['lb-LU'] = taxIdCheck['fr-LU'];
taxIdCheck['lt-LT'] = taxIdCheck['et-EE'];
taxIdCheck['nl-BE'] = taxIdCheck['fr-BE'];
taxIdCheck['fr-CA'] = taxIdCheck['en-CA'];

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
  // Copy TIN to avoid replacement if sanitized
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
