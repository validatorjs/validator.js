/* eslint-disable max-len */

/**
 * Reference
 * https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number#Checksum_calculation
 */
function uniqueMasterCitizenNumber(str) {
  const a = parseInt(str[0], 10);
  const b = parseInt(str[1], 10);
  const c = parseInt(str[2], 10);
  const d = parseInt(str[3], 10);
  const e = parseInt(str[4], 10);
  const f = parseInt(str[5], 10);
  const g = parseInt(str[6], 10);
  const h = parseInt(str[7], 10);
  const i = parseInt(str[8], 10);
  const j = parseInt(str[9], 10);
  const k = parseInt(str[10], 10);
  const l = parseInt(str[11], 10);
  // Foreigners with temporary residence cannot be validated via checksum
  // ref: http://www.ubs-asb.com/Portals/0/Casopis/2008/3_4/B03-04-2008-PO.pdf
  if (h === 6 && i === 6) {
    return true;
  }
  let m = 11 - (((7 * (a + g)) + (6 * (b + h)) + (5 * (c + i)) + (4 * (d + j)) + (3 * (e + k)) + (2 * (f + l))) % 11);
  m = m > 9 ? 0 : m;
  return str[str.length - 1] === `${m}`;
}

/**
 * Reference
 * https://en.wikipedia.org/wiki/Social_insurance_number#Validation
 */
function validateSIN(str) {
  str = str.replace(/\D/g, '');
  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    const digit = parseInt(str[i], 10);
    const factor = ((i % 2) === 0) ? 1 : 2;
    const result = digit * factor;
    if (result >= 10) {
      sum += Math.floor(result / 10) + (result % 10);
    } else {
      sum += result;
    }
  }
  return (sum % 10 === 0);
}

function validateCURP(str) {
  const alphabets = {
    A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 18, J: 19, K: 20, L: 21, M: 22, N: 23, Ñ: 24, O: 25, P: 26, Q: 27, R: 28, S: 29, T: 30, U: 31, V: 32, W: 33, X: 34, Y: 35, Z: 36,
  };
  let sum = 0;
  for (let i = 0; i <= 16; i += 1) {
    const code = str[i];
    sum += (isNaN(code) ? alphabets[code] : parseInt(code, 10)) * (18 - i);
  }
  let checksum = (10 - (sum % 10)) % 10;
  checksum = checksum === 10 ? 0 : checksum;
  return str[str.length - 1] === `${checksum}`;
}

function validateUCN(str) {
  const weights = [2, 4, 8, 5, 10, 9, 7, 3, 6];
  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    const digit = parseInt(str[i], 10);
    const factor = weights[i];
    sum += digit * factor;
  }
  let checksum = sum % 11;
  checksum = checksum > 9 ? 0 : checksum;
  return str[str.length - 1] === `${checksum}`;
}

/**
 * Reference
 * https://en.wikipedia.org/wiki/Verhoeff_algorithm#Examples
 */
function validateAadharCard(str) {
  str = str.replace(/\D/g, '');
  str = str.split('');
  const cs = parseInt(str.pop(), 10);
  const multiplication = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];
  const permutation = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];
  const inverse = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];
  let check = 0;
  let invertedArray = str.reverse();
  for (let i = 0; i < invertedArray.length; i++) {
    check = multiplication[check][permutation[((i + 1) % 8)][invertedArray[i]]];
  }
  return inverse[check] === cs;
}

function validateItalianFiscalCode(str) {
  const tables = {
    checksums: {
      0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z',
    },
    alternateChecksums: {
      0: 'L', 1: 'M', 2: 'N', 3: 'P', 4: 'Q', 5: 'R', 6: 'S', 7: 'T', 8: 'U', 9: 'V',
    },
    odd: {
      0: 1, 1: 0, 2: 5, 3: 7, 4: 9, 5: 13, 6: 15, 7: 17, 8: 19, 9: 21, I: 19, R: 8, A: 1, J: 21, S: 12, B: 0, K: 2, T: 14, C: 5, L: 4, U: 16, D: 7, M: 18, V: 10, E: 9, N: 20, W: 22, F: 13, O: 11, X: 25, G: 15, P: 3, Y: 24, H: 17, Q: 6, Z: 23,
    },
    even: {
      0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, I: 8, R: 17, A: 0, J: 9, S: 18, B: 1, K: 10, T: 19, C: 2, L: 11, U: 20, D: 3, M: 12, V: 21, E: 4, N: 13, W: 22, F: 5, O: 14, X: 23, G: 6, P: 15, Y: 24, H: 7, Q: 16, Z: 25,
    },
  };
  let checksum = 0;
  for (let i = 0; i < 15; i += 1) {
    const char = str[i];
    checksum += (i % 2 === 0) ? tables.odd[char] : tables.even[char];
  }
  // (tables.checksums[checksum % 26] === str[str.length - 1]) || (tables.alternateChecksums[checksum % 26] === str[str.length - 1])
  return tables.checksums[checksum % 26] === str[str.length - 1];
}

export default function validateNationalIdChecksum(str, cc) {
  switch (cc) {
    case 'BG':
      return validateUCN(str);
    case 'BA':
    case 'HR':
    case 'ME':
    case 'MK':
    case 'RS':
    case 'SI':
    case 'XK':
      return uniqueMasterCitizenNumber(str);
    case 'CA':
      return validateSIN(str);
    case 'IN':
      return validateAadharCard(str);
    case 'IT':
      return validateItalianFiscalCode(str);
    case 'MX':
      return validateCURP(str);
    default:
      // Safely ignore countries that are not supported yet or countries that doesn't support checksum scheme.
      return true;
  }
}
