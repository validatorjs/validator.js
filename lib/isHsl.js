'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHsl;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_ishsl_options = {
  allow_transparent: true
};

function isHsl(val, options) {
  (0, _assertString2.default)(val);
  options = (0, _merge2.default)(options, default_ishsl_options);

  if (options.allow_transparent === 'true' && val === 'transparent') {
    return true;
  }

  var removedSpace = val.replace(/ /g, '');
  var regex = /hsl\(-?[0-9]{1,3},[0-9]{1,3}%,[0-9]{1,3}%\)/i;

  if (removedSpace.match(regex)) {
    var removeHslCall = removedSpace.replace(/hsl/g, '');
    var removeBrackets = removeHslCall.replace(/\(/g, '').replace(/\)/g, '');
    var valueSliced = removeBrackets.split(',');
    var isValid = true;

    valueSliced.forEach(function (i, index) {
      var parsedInt = parseInt(i, 10);

      if (Number.isInteger(parsedInt)) {
        if (index !== 0) {
          var isInRange = parsedInt >= 0 && parsedInt <= 100;
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
module.exports = exports['default'];