import assertString from './util/assertString';

const charsetRegex = /^[a-z0-9](?!.*[-_]{2,})(?:[a-z0-9_-]*[a-z0-9])?$/;

export default function isSlug(str) {
  assertString(str);
  return (charsetRegex.test(str));
}
