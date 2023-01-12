import assertString from './util/assertString.js';

export default function isLowercase(str) {
  assertString(str);
  return str === str.toLowerCase();
}
