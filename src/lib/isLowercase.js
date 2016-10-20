import { assertString } from './util/assertString';

export const isLowercase = (str) => {
  assertString(str);
  return str === str.toLowerCase();
}
