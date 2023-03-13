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

export default function validateNationalIdChecksum(str, cc) {
  switch (cc) {
    case 'BA':
    case 'HR':
    case 'ME':
    case 'MK':
    case 'RS':
    case 'SI':
    case 'XK':
      return uniqueMasterCitizenNumber(str);
    default:
      // Safely ignore countries that are not supported yet or countries that doesn't support checksum calculation.
      return true;
  }
}
