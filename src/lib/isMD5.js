import { assertString } from './util/assertString';

const md5 = /^[a-f0-9]{32}$/;

export const isMD5 = (str) => {
  assertString(str);
  return md5.test(str);
}
