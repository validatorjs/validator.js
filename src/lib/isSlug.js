import assertString from './util/assertString';

let charsetRegex = /^(?![-_])^[^\s](?!.*?[-_]{2,})[a-z0-9*&\\]*(?:[-_][a-z0-9*&\\]+)*[^-_\s](?!\.)$/;
// /^(?!.*\.)[^\s-_][a-z0-9-\\][^\s]*[^-_\s]$/

export default function isSlug(str) {
  assertString(str);
  return (charsetRegex.test(str));
}
