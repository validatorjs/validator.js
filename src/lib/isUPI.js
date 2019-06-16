import assertString from './util/assertString';

export default function isHash(str, algorithm) {
  assertString(str);
  const hash = new RegExp(`^[a-zA-Z0-9\.\-]{2,256}\@[a-zA-Z][a-zA-Z]{2,64}$`);
  return hash.test(str);
}
