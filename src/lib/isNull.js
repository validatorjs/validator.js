import assertString from './util/assertString';

export default function isNull(str) {
  assertString(str);
  return str.length === 0;
}
