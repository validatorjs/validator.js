import assertString from './util/assertString.js';

const hexadecimal = /^(0x|0h)?[0-9A-F]+$/i;

export default function isHexadecimal(str) {
  assertString(str);
  return hexadecimal.test(str);
}
