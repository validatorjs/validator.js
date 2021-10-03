import assertString from './util/assertString';

const rgbColor = /^rgb\( ?(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]) ?, ?){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]) ?\)$/;
const rgbaColor = /^rgba\( ?(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]) ?, ?){3}(0?\.\d|1(\.0)?|0(\.0)?) ?\)$/;
const rgbColorPercent = /^rgb\( ?(([0-9]%|[1-9][0-9]%|100%) ?, ?){2}([0-9]%|[1-9][0-9]%|100%) ?\)/;
const rgbaColorPercent = /^rgba\( ?(([0-9]%|[1-9][0-9]%|100%) ?, ?){3}(0?\.\d|1(\.0)?|0(\.0)?) ?\)/;

export default function isRgbColor(str, includePercentValues = true) {
  assertString(str);

  const strippedString = str.replace(/\s+/g, ' ').replace(/\s?(rgba?\(|\)|,)\s?/g, '$1');

  if (!includePercentValues) {
    return rgbColor.test(strippedString) || rgbaColor.test(strippedString);
  }

  return rgbColor.test(strippedString) ||
    rgbaColor.test(strippedString) ||
    rgbColorPercent.test(strippedString) ||
    rgbaColorPercent.test(strippedString);
}
