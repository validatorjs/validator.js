import assertString from './util/assertString.js';

import { fullWidth } from './isFullWidth.js';
import { halfWidth } from './isHalfWidth.js';

export default function isVariableWidth(str) {
  assertString(str);
  return fullWidth.test(str) && halfWidth.test(str);
}
