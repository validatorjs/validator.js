import assertString from './util/assertString';

import merge from './util/merge';

const default_isrgb_options = {
  allow_transparent: true,
};

export default function isRgb(val, options) {
  assertString(val);
  options = merge(options, default_isrgb_options);

  if (options.allow_transparent === 'true' && val === 'transparent') {
    return true;
  }

  let removedSpace = val.replace(/ /g, '');
  let regex = /rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)/i;

  if (removedSpace.match(regex)) {
    let removeRgbCall = removedSpace.replace(/rgb/g, '');
    let removeBrackets = removeRgbCall.replace(/\(/g, '').replace(/\)/g, '');
    let valueSliced = removeBrackets.split(',');
    let isValid = true;

    valueSliced.forEach((i) => {
      let parsedInt = parseInt(i, 10);
      if ((Number.isInteger(parsedInt) && parsedInt >= 0 && parsedInt <= 255) === false) {
        isValid = false;
      }
    });
    return isValid;
  }

  return false;
}
