import assertString from './util/assertString';

const rgbColor = /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/;
const rgbaColor = /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
const rgbColorPercent = /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)$/;
const rgbaColorPercent = /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
const startsWithRgb = /^rgba?/;

export default function isRgbColor(str, includePercentValues = true) {
  assertString(str);
  // remove spaces
  const strippedStr = str.replace(/\s/g, '');

  if (!includePercentValues) {
    return rgbColor.test(strippedStr) || rgbaColor.test(strippedStr);
  }

  return startsWithRgb.test(str) && (rgbColor.test(strippedStr) ||
    rgbaColor.test(strippedStr) ||
    rgbColorPercent.test(strippedStr) ||
    rgbaColorPercent.test(strippedStr));
}
