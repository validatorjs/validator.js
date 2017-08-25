import assertString from './util/assertString';

import merge from './util/merge';

const default_ishsla_options = {
  allow_transparent: true,
};

let filterFloat = function (value) {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
    .test(value)) {
    return Number(value);
  }
  return NaN;
};

export default function isHsla(val, options) {
  assertString(val);
  options = merge(options, default_ishsla_options);

  if (options.allow_transparent === 'true' && val === 'transparent') {
    return true;
  }

  let removedSpace = val.replace(/ /g, '');
  let regex = /\([0-9]{1,3},[0-9]{1,3}%,[0-9]{1,3}%,[0,1]{1}.?[0-9]*\)/i;

  if (removedSpace.match(regex)) {
    let removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
    let valueSliced = removeBrackets.split(',');
    let isValid = true;

    valueSliced.forEach((i, index) => {
      let value = filterFloat(i);

      if (Number.isInteger(value)) {
        if (index === 0) {
          const isInRange = value >= 0 && value <= 360;
          if (!isInRange) {
            isValid = false;
          }
        } else {
          const isInRange = value >= 0 && value <= 100;
          if (!isInRange) {
            isValid = false;
          }
        }
      } else if (isNaN(value)) {
        // percent value
        value = parseInt(i, 10);
        const isInRange = value >= 0 && value <= 100;
        if (!isInRange) {
          isValid = false;
        }
      } else {
        const isInRange = value >= 0 && value <= 1;
        if (!isInRange) {
          isValid = false;
        }
      }
    });
    return isValid;
  }

  return false;
}
