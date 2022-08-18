import assertString from './util/assertString';

const rgbColor = /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/;
const rgbaColor = /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
const rgbColorPercent = /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)$/;
const rgbaColorPercent = /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
const startsWithRgb = /^rgba?/;

export default function isRgbColor(str, includePercentValues = true, strict = true) {
  assertString(str);
  // remove spaces
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
