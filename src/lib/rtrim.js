import assertString from './util/assertString';

export default function rtrim(str, chars) {
  assertString(str);
  const pattern = chars ? new RegExp(`[${chars}]+$`, 'g') : /\s+$/g;
  return str.replace(pattern, '');
}
