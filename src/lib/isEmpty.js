import { assertString } from './util/assertString';

export const isEmpty = (str) => {
  assertString(str);
  return str.length === 0;
}
