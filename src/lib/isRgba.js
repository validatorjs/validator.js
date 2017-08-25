import assertString from './util/assertString';

import merge from './util/merge';

const default_isrgba_options = {
  allow_transaprent: true,
};

const filterFloat = function(value) {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value))
    return Number(value);
  return NaN;
}

const isBetween0and1 = function(value) {
  return value > 0 && value < 1;
}

/* eslint-disable max-len */
/* eslint-disable no-control-regex */
/* eslint-enable max-len */
/* eslint-enable no-control-regex */

export default function isRgba(val, options) {
  assertString(val);
  options = merge(options, default_isrgba_options);

  if (default_isrgba_options.allow_transaprent === 'true' && val === 'transparent') {
    return true;
  }
  ;

  var removedSpace = val.replace(/ /g, '');
  var regex = /\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},[0,1]{1}.?[0-9]*\)/i;

  if (removedSpace.match(regex)) {
    var removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
    var valueSliced = removeBrackets.split(',');
    var isValid = true;

    valueSliced.forEach(function(i, index) {
      var value = filterFloat(i);
      if (Number.isInteger(value)) {
        var isInRange = value >= 0 && value <= 255;
        if (!isInRange) {
          isValid = false;
        }
      } else {
        if (!isBetween0and1(value)) {
          isValid = false;
        }
      }
    });
    return isValid;
  }

  return false;
}
