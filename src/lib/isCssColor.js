import isHexColor from './isHexColor';
import isRgbColor from './isRgbColor';
import isKeywordColor from './isKeywordColor';
import isHSL from './isHSL';

export default function isCssColor(str) {
  return isHexColor(str) || isRgbColor(str) || isKeywordColor(str) || isHSL(str);
}
