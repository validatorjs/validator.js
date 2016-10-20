import { assertString } from './util/assertString';

export const toInt = (str, radix) => {
  assertString(str);
  return parseInt(str, radix || 10);
}
