import assertString from './util/assertString';

/* eslint-disable no-control-regex */
const md5 = /^[a-f0-9]{32}$/;
/* eslint-enable no-control-regex */

export default function isMD5(str) {
  assertString(str);
  return md5.test(str);
}
