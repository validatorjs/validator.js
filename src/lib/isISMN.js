import assertString from './util/assertString';

export default function isISMN(str) {
  assertString(str);

  // Check for spaces or hyphens at the beginning, end, or repeated together.
  if (/^[ -]|[ -]$|[ -]{2}/.test(str)) {
    return false;
  }

  // Remove spaces and hyphens so we can check the number.
  let ismn = str.replace(/[ -]/g, '');

  // Change the older ISMN format to the 13-digit version.
  if (/^M[0-9]{9}$/.test(ismn)) {
    ismn = `9790${ismn.slice(1)}`;
  }

  // Make sure it has 13 digits and starts with 9790.
  if (!/^9790[0-9]{9}$/.test(ismn)) {
    return false;
  }

  // Go through the first 12 digits to calculate the check digit.
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    const digit = Number(ismn[i]);
    const weight = i % 2 === 0 ? 1 : 3;
    sum += digit * weight;
  }

  // Find what the last digit should be.
  const checkDigit = (10 - (sum % 10)) % 10;

  // Check if the last digit matches what we calculated.
  return checkDigit === Number(ismn[12]);
}
