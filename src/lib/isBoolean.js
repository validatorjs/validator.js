import { assertString } from './util/assertString';

export const isBoolean = (str) => {
  assertString(str);

  return (['true', 'false', '1', '0'].indexOf(str) >= 0);
}
