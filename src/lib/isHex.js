import assertString from './util/assertString';

import merge from './util/merge';

const default_ishex_options = {
  allow_transparent: true,
};

export default function isHex(val, options) {
  assertString(val);
  options = merge(options, default_ishex_options);

  if (options.allow_transparent && val === 'transparent') {
    return true;
  }

  let startWithHex = val[0] === '#';

  if (!startWithHex) {
    return false;
  }

  let isCorrectLength = val.length === 4 || val.length === 7;

  if (isCorrectLength) {
    let regex = /[0-9a-f]/i;
    let valueSliced = val.slice(1).split('');
    let isValid = true;
    valueSliced.forEach((i) => {
      if (i.match(regex) === null) {
        isValid = false;
      }
    });
    return isValid;
  }

  return false;
}
