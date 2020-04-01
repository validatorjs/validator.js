import assertString from './util/assertString';

export default function isBase64Url(str) {
  assertString(str);

  return /^[A-Za-z0-9_-]+$/.test(str);
}
