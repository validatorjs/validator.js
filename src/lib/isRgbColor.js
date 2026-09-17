/* eslint-disable prefer-rest-params */
import assertString from './util/assertString';

const rgbColor = /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/;
const rgbaColor = /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d+|1(\.0+)?|0(\.0+)?)\)$/;
const rgbColorPercent = /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)$/;
const rgbaColorPercent = /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d+|1(\.0+)?|0(\.0+)?)\)$/;
const startsWithRgb = /^rgba?/;

export default function isRgbColor(str, options) {
  assertString(str);
  // default options to true for percent and false for spaces
  let allowSpaces = false;
  let includePercentValues = true;
  if (typeof options !== 'object') {
    if (arguments.length >= 2) {
      includePercentValues = arguments[1];
    }
  } else {
    allowSpaces = options.allowSpaces !== undefined ? options.allowSpaces : allowSpaces;
    includePercentValues = options.includePercentValues !== undefined ?
      options.includePercentValues : includePercentValues;
  }

  if (allowSpaces) {
    // make sure it starts with continuous rgba? without spaces before stripping
    if (!startsWithRgb.test(str)) {
      return false;
    }
    // collapse whitespace runs, then drop only the whitespace adjacent to the
    // parentheses and commas; whitespace inside a channel/alpha/percent token is
    // kept so malformed values such as 'rgb(2 55,0,0)' or 'rgb(25 %,0%,0%)' are
    // still rejected. Two linear passes avoid polynomial backtracking (#2885)
    str = str.replace(/\s+/g, ' ').replace(/ ?([(),]) ?/g, '$1');
  }

  if (!includePercentValues) {
    return rgbColor.test(str) || rgbaColor.test(str);
  }

  return rgbColor.test(str) ||
    rgbaColor.test(str) ||
    rgbColorPercent.test(str) ||
    rgbaColorPercent.test(str);
}
