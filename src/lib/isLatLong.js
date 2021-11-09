import assertString from './util/assertString';
import isLat from './isLat';
import isLong from './isLong';

export default function isLatLong(str, options) {
  assertString(str);

  if (!str.includes(',')) return false;
  const pair = str.split(',');
  if ((pair[0].startsWith('(') && !pair[1].endsWith(')'))
    || (pair[1].endsWith(')') && !pair[0].startsWith('('))) return false;

  return isLat(pair[0], options) && isLong(pair[1], options);
}
