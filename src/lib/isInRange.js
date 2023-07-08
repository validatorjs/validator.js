import assertString from './util/assertString';
import toFloat from './toFloat';

/* eslint-disable prefer-rest-params */
export default function isInRange(str, options) {
  assertString(str);
  let min;
  let max;
  if (typeof (options) === 'object') {
    min = options.min;
    max = options.max;
  } else { // backwards compatibility: isInRange(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }
  if (!min || !max) {
    throw new Error('Min or Max is not provided');
  }
  return toFloat(str) >= min && toFloat(str) <= max;
}
