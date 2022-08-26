/* eslint-disable prefer-rest-params */
import assertString from './util/assertString';

const rgbColor = /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/;
const rgbaColor = /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
const rgbColorPercent = /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)$/;
const rgbaColorPercent = /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
const startsWithRgb = /^rgba?/;

export default function isRgbColor(str, options) {
  assertString(str);
  // remove spaces
  let strict, includePercentValues;

  if (typeof options !== 'object') {
    // backward compaitable behaviour
    strict = true;
    includePercentValues = true;
    if (arguments.length >= 2) {
      includePercentValues = arguments[1];
    }
    if (arguments.length >= 3) {
      strict = arguments[2];
    }
  } else {
    strict = options.strict !== undefined ? options.strict : true;
    includePercentValues = options.includePercentValues !== undefined ?
      options.includePercentValues : true;
  }

  if (!strict) {
    // make sure it starts with continous rgba? without spaces before stripping
    if (!startsWithRgb.test(str)) {
      return false;
    }
    str = str.replace(/\s/g, '');
  }

  if (!includePercentValues) {
    return rgbColor.test(str) || rgbaColor.test(str);
  }

  return rgbColor.test(str) ||
    rgbaColor.test(str) ||
    rgbColorPercent.test(str) ||
    rgbaColorPercent.test(str);
}
