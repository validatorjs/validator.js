'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRgba;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_isrgba_options = {
  allow_transparent: true
};

var filterFloat = function filterFloat(value) {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
    return Number(value);
  }
  return NaN;
};

var isBetween0and1 = function isBetween0and1(value) {
  value = filterFloat(Number(value).toFixed(20));
  return value >= 0 && value <= 1;
};

function isRgba(val, options) {
  (0, _assertString2.default)(val);
  options = (0, _merge2.default)(options, default_isrgba_options);

  if (options.allow_transparent === 'true' && val === 'transparent') {
    return true;
  }

  var removedSpace = val.replace(/ /g, '');
  var regex = /rgba\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},[0,1]?.?[0-9]*\)/i;

  if (removedSpace.match(regex)) {
    var removeRgbaCall = removedSpace.replace(/rgba/g, '');
    var removeBrackets = removeRgbaCall.replace(/\(/g, '').replace(/\)/g, '');
    var valueSliced = removeBrackets.split(',');
    var isValid = true;

    valueSliced.forEach(function (i, index) {
      var value = filterFloat(i);
      if (Number.isInteger(value)) {
        var isInRange = value >= 0 && value <= 255;
        if (!isInRange) {
          isValid = false;
        }

        if (isValid && index === 3) {
          isValid = value >= 0 && value < 2;
        }
      } else if (!isBetween0and1(i)) {
        isValid = false;
      }
    });
    return isValid;
  }

  return false;
}
module.exports = exports['default'];