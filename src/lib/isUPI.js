import assertString from './util/assertString';

const upiRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+$/;

export default function isUPI(str) {
  assertString(str);
  return upiRegex.test(str);
}
