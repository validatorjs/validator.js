import assertString from './util/assertString';

export default function toBoolean(str, strict) {
  assertString(str);
  if (strict) {
    return str === '1' || str === 'true';
  }
  return str !== '0' && str !== 'false' && str !== '';
}
