import { assertString } from './util/assertString';

export const whitelist = (str, chars) => {
  assertString(str);
  return str.replace(new RegExp(`[^${chars}]+`, 'g'), '');
}
