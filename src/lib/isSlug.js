import assertString from './util/assertString';

let charsetRegex = /^[^\s-_](?!.*?[-_]{2,})[a-z0-9-\\][^\s]*[^-_\s]$/;

export default function isSlug(str) {
  assertString(str);
  return (charsetRegex.test(str));
}
