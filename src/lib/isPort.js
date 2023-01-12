import isInt from './isInt.js';

export default function isPort(str) {
  return isInt(str, { min: 0, max: 65535 });
}
