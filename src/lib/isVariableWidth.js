import { assertString } from './util/assertString';

import { fullWidth } from './isFullWidth';
import { halfWidth } from './isHalfWidth';

export const isVariableWidth = (str) => {
  assertString(str);
  return fullWidth.test(str) && halfWidth.test(str);
}
