import { assertString } from './util/assertString';

export const toBoolean = (str, strict) => {
  assertString(str);
  if (strict) {
    return str === '1' || str === 'true';
  }
  return str !== '0' && str !== 'false' && str !== '';
}
