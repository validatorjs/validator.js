import assertString from './util/assertString';

let regex = new RegExp('^[0-9]{9}$', '');

export default function isRTN(str) {
  assertString(str);
  if (!regex.test(str)) {
    return false;
  }

  const digits = str.split('').map(d => parseInt(d, 10));
  let checksum =
    3 * (digits[0] + digits[3] + digits[6]);

  checksum += 7 * (digits[1] + digits[4] + digits[7]);
  checksum +=
    (digits[2] + digits[5] + digits[8]);

  return checksum % 10 === 0;
}
