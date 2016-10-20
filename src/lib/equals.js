import { assertString } from './util/assertString';

export const equals = (str, comparison) => {
  assertString(str);

  return str === comparison;
}
