import assertString from './util/assertString';

export default function isEmpty(str) {
  assertString(str);
  return str.length === 0;
}
