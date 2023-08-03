import assertString from './util/assertString';

import isHexColor from './isHexColor';
import isHSL from './isHSL';
import isRgbColor from './isRgbColor';

export default function (str, options = {}) {
  assertString(str);
  if (!options.format) return isHexColor(str) || isHSL(str) || isRgbColor(str);

  if (options.format === 'hex') return isHexColor(str);
  if (options.format === 'rgb') return isRgbColor(str);
  if (options.format === 'hsl') return isHSL(str);
  return false;
}
