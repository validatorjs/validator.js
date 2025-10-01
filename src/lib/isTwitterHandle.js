import assertString from './util/assertString';

/* eslint-disable no-control-regex */
const twitterHandle = /^@?[A-Za-z0-9_]{1,15}$/;
/* eslint-enable no-control-regex */

export default function isTwitterHandle(str) {
  assertString(str);
  return twitterHandle.test(str);
}
