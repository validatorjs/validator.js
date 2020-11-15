import assertString from './util/assertString';

export default function allowlist(str, chars) {
  assertString(str);
  return str.replace(new RegExp(`[^${chars}]+`, 'g'), '');
}
