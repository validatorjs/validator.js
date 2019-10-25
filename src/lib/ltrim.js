import assertString from './util/assertString';

export default function ltrim(str, chars) {
  assertString(str);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
  const pattern = chars ? new RegExp(`^[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+`, 'g') : /^\s+/g;
  return str.replace(pattern, '');
}
