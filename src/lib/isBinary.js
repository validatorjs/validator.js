import assertString from './util/assertString';

const binary = /^[0-1]*$/i;

export default function isBinary(str) {
  assertString(str);
  if (str.length === 0) return false;
  return binary.test(str);
}
