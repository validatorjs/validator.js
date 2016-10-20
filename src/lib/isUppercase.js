import { assertString } from './util/assertString';

export const isUppercase = (str) => {
  assertString(str);
  return str === str.toUpperCase();
}
