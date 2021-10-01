import assertString from './util/assertString';

const rgbColor = /^rgb\(\s*(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*,\s*){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*\)$/;
const rgbaColor = /^rgba\(\s*(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*,\s*){3}(0?\.\d|1(\.0)?|0(\.0)?)\s*\)$/;
const rgbColorPercent = /^rgb\(\s*(([0-9]%|[1-9][0-9]%|100%)\s*,\s*){2}([0-9]%|[1-9][0-9]%|100%)\s*\)/;
const rgbaColorPercent = /^rgba\(\s*(([0-9]%|[1-9][0-9]%|100%)\s*,\s*){3}(0?\.\d|1(\.0)?|0(\.0)?)\s*\)/;

export default function isRgbColor(str, includePercentValues = true) {
  assertString(str);

  if (!includePercentValues) {
    return rgbColor.test(str) || rgbaColor.test(str);
  }

  return rgbColor.test(str) ||
    rgbaColor.test(str) ||
    rgbColorPercent.test(str) ||
    rgbaColorPercent.test(str);
}
