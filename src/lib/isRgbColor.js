import assertString from './util/assertString';

const rgbColor = /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/;
const rgbaColor = /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
const rgbColorPercent = /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)/;
const rgbaColorPercent = /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)/;

export default function isRgbColor(str, includePercentValues = true) {
  assertString(str);
  if (!includePercentValues) {
    return rgbColor.test(str) || rgbaColor.test(str);
  }

  const spaceCount = (str.split(' ').length - 1);
  console.log(spaceCount);
  const commaCount = (str.split(', ').length - 1);
  console.log(commaCount);
  const percentageCount = (str.split('%, ').length - 1);
  console.log(percentageCount);
  if (spaceCount !== commaCount && spaceCount !== percentageCount) {
    console.log('Please provide valid input like rgb(255,255,255) or rgb(255, 255, 255) or rgba(5%,5%,5%,.3) or rgba(5%, 5%, 5%, .3)');
    return false;
  }
  str = str.replace(/\s/g, '');

  return rgbColor.test(str) ||
    rgbaColor.test(str) ||
    rgbColorPercent.test(str) ||
    rgbaColorPercent.test(str);
}
