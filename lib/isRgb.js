'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRgb;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_isrgb_options = {
  allow_transparent: true
};

function isRgb(val, options) {
  (0, _assertString2.default)(val);
  options = (0, _merge2.default)(options, default_isrgb_options);

  if (options.allow_transparent === 'true' && val === 'transparent') {
    return true;
  }

  var removedSpace = val.replace(/ /g, '');
  var regex = /rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)/i;

  if (removedSpace.match(regex)) {
    var removeRgbCall = removedSpace.replace(/rgb/g, '');
    var removeBrackets = removeRgbCall.replace(/\(/g, '').replace(/\)/g, '');
    var valueSliced = removeBrackets.split(',');
    var isValid = true;

    valueSliced.forEach(function (i) {
      var parsedInt = parseInt(i, 10);
      if ((Number.isInteger(parsedInt) && parsedInt >= 0 && parsedInt <= 255) === false) {
        isValid = false;
      }
    });
    return isValid;
  }

  return false;
}
module.exports = exports['default'];