import { assertString } from './util/assertString';

export const matches = (str, pattern, modifiers) => {
  assertString(str);
  if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
    pattern = new RegExp(pattern, modifiers);
  }
  return pattern.test(str);
}
