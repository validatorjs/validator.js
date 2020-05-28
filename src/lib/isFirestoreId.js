import assertString from './util/assertString';

export default function isFirestoreId(str) {
  const alnum = /[a-zA-Z0-9]{20}/;
  assertString(str);
  return alnum.test(str) && str.length === 20;
}
