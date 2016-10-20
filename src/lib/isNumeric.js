import { assertString } from './util/assertString';

const numeric = /^[-+]?[0-9]+$/;

export const isNumeric = (str) => {
  assertString(str);
  return numeric.test(str);
}
