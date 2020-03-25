import assertString from './util/assertString';
export default function isBoolean(str) {
  assertString(str);
  return ['true', 'false', '1', '0'].indexOf(str) >= 0;
}