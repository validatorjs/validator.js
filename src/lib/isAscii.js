import assertString from './util/assertString';

const ascii = /^[\x00-\x7F]+$/; // eslint-disable-line no-control-regex

export default function isAscii(str) {
  assertString(str);
  return ascii.test(str);
}
