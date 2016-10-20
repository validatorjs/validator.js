import { assertString } from './util/assertString';

export const blacklist = (str, chars) => {
  assertString(str);

  return str.replace(new RegExp(`[${chars}]+`, 'g'), '');
}
