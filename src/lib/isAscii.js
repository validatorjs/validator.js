import { assertString } from './util/assertString';

/* eslint-disable no-control-regex */
const ascii = /^[\x00-\x7F]+$/;
/* eslint-enable no-control-regex */

export const isAscii = (str) => {
  assertString(str);
  return ascii.test(str);
}
