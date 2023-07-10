import assertString from './util/assertString';

export default function toCapitalize(str) {
  assertString(str);

  return str.replace(/(^|[,.!?]|[\s\n])(\w+)/g, (_, m1, m2) => m1 + m2.charAt(0).toUpperCase() + m2.slice(1).toLowerCase());
}
