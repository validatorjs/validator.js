import assertString from './util/assertString';

import merge from './util/merge';

const default_isrgba_options = {
  allow_transparent: true,
};

const filterFloat = function (value) {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) { return Number(value); }
  return NaN;
};

const isBetween0and1 = function (value) {
  return value > 0 && value < 1;
};

export default function isRgba(val, options) {
  assertString(val);
  options = merge(options, default_isrgba_options);

  if (options.allow_transparent === 'true' && val === 'transparent') {
    return true;
  }


  let removedSpace = val.replace(/ /g, '');
  let regex = /\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},[0,1]{1}.?[0-9]*\)/i;

  if (removedSpace.match(regex)) {
    let removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
    let valueSliced = removeBrackets.split(',');
    let isValid = true;

    valueSliced.forEach((i) => {
      let value = filterFloat(i);
      if (Number.isInteger(value)) {
        let isInRange = value >= 0 && value <= 255;
        if (!isInRange) {
          isValid = false;
        }
      } else if (!isBetween0and1(value)) {
        isValid = false;
      }
    });
    return isValid;
  }

  return false;
}
