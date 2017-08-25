import assertString from './util/assertString';

import merge from './util/merge';

const default_ishsl_options = {
  allow_transparent: true,
};

export default function isHsl(val, options) {
  assertString(val);
  options = merge(options, default_ishsl_options);

  if (options.allow_transparent === 'true' && val === 'transparent') {
    return true;
  }

  let removedSpace = val.replace(/ /g, '');
  let regex = /\([0-9]{1,3},[0-9]{1,3}%,[0-9]{1,3}%\)/i;

  if (removedSpace.match(regex)) {
    let removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
    let valueSliced = removeBrackets.split(',');
    let isValid = true;

    valueSliced.forEach((i, index) => {
      let parsedInt = parseInt(i, 10);

      if (Number.isInteger(parsedInt)) {
        if (index === 0) {
          const isInRange = parsedInt >= 0 && parsedInt <= 360;
          if (!isInRange) {
            isValid = false;
          }
        } else {
          const isInRange = parsedInt >= 0 && parsedInt <= 100;
          if (!isInRange) {
            isValid = false;
          }
        }
      } else {
        isValid = false;
      }
    });
    return isValid;
  }

  return false;
}
