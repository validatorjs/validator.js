'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHsla;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_ishsla_options = {
  allow_transparent: true
};

var filterFloat = function filterFloat(value) {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
    return Number(value);
  }
  return NaN;
};

function isHsla(val, options) {
  (0, _assertString2.default)(val);
  options = (0, _merge2.default)(options, default_ishsla_options);

  if (options.allow_transparent && val === 'transparent') {
    return true;
  }

  var removedSpace = val.replace(/ /g, '');
  var regex = /hsla\(-?[0-9]{1,3},[0-9]{1,3}%,[0-9]{1,3}%,[0,1]?.?[0-9]*\)/i;

  if (removedSpace.match(regex)) {
    var removeHslaCall = removedSpace.replace(/hsla/g, '');
    var removeBrackets = removeHslaCall.replace(/\(/g, '').replace(/\)/g, '');
    var valueSliced = removeBrackets.split(',');
    var isValid = true;

    valueSliced.forEach(function (i, index) {
      var value = filterFloat(i);
      var parsedInt = parseInt(i, 10);

      if (Number.isInteger(value)) {
        if (index !== 0 && index !== 3) {
          var isInRange = value >= 0 && value <= 100;
          if (!isInRange) {
            isValid = false;
          }
        }

        if (isValid && index === 3) {
          isValid = value >= 0 && value < 2;
        }
      } else if (isNaN(value) && Number.isInteger(parsedInt)) {
        var _isInRange = parsedInt >= 0 && parsedInt <= 100;
        if (!_isInRange) {
          isValid = false;
        }
      } else {
        value = filterFloat(Number(i).toFixed(20));

        var _isInRange2 = value >= 0 && value <= 1;
        if (!_isInRange2) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  return false;
}
module.exports = exports['default'];