import assertString from './util/assertString';

let charsetRegex = /^(?!.*\.)[^\s-_][a-z0-9-\\][^\s]*[^-_\s]$/;

export default function isSlug(str) {
  assertString(str);
  return (charsetRegex.test(str));
}
