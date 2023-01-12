import assertString from './util/assertString.js';

export default function isUppercase(str) {
  assertString(str);
  return str === str.toUpperCase();
}
