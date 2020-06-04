import assertString from './util/assertString.js';

export default function isBoolean(str) {
  assertString(str);
  return (['true', 'false', '1', '0'].indexOf(str) >= 0);
}
