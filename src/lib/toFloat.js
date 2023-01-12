import isFloat from './isFloat.js';

export default function toFloat(str) {
  if (!isFloat(str)) return NaN;

  return parseFloat(str);
}
