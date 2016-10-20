import { assertString } from './util/assertString';

const hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;

export const isHexColor = (str) => {
  assertString(str);
  return hexcolor.test(str);
}
