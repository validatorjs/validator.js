import { assertString } from './util/assertString';

const hexadecimal = /^[0-9A-F]+$/i;

export const isHexadecimal = (str) => {
  assertString(str);
  return hexadecimal.test(str);
}
