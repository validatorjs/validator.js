import assertString from '../util/assertString';

const ascii = /^[\x00-\x7F]+$/;

export default function isAscii(str) {
  assertString(str);
  return ascii.test(str);
}
