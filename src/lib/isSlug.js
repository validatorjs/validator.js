import assertString from './util/assertString';

let charsetRegex = /^(?!.*(?:-|_){2,})(?![-_])(?!.*(?:-|_)$)[a-z0-9*&\\]*(?:[-_][a-z0-9*&\\]+)*$/;

export default function isSlug(str) {
  assertString(str);
  return (charsetRegex.test(str));
}
