import assertString from './util/assertString';
export default function toFloat(str) {
  assertString(str);
  return parseFloat(str);
}