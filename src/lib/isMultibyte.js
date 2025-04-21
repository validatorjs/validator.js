import assertString from './util/assertString';

const multibyte = /[^\x00-\x7F]/; // eslint-disable-line no-control-regex

export default function isMultibyte(str) {
  assertString(str);
  return multibyte.test(str);
}
