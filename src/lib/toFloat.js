import { assertString } from './util/assertString';

export const toFloat = (str) => {
  assertString(str);
  return parseFloat(str);
}
