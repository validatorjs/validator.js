import { assertString } from './util/assertString';

const surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

export const isSurrogatePair = (str) => {
  assertString(str);
  return surrogatePair.test(str);
}
