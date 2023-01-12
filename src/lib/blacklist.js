import assertString from './util/assertString.js';

export default function blacklist(str, chars) {
  assertString(str);
  return str.replace(new RegExp(`[${chars}]+`, 'g'), '');
}
