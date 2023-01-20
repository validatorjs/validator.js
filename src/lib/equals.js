import assertString from './util/assertString.js';

export default function equals(str, comparison) {
  assertString(str);
  return str === comparison;
}
