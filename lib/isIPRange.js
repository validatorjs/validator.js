'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIPRange;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ipv4RangeMaybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/;

function isIPRange(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  (0, _assertString2.default)(str);
  version = String(version);
  if (!version) {
    return isIPRange(str, 4) || isIPRange(str, 6);
  } else if (version === '4') {
    if (!ipv4RangeMaybe.test(str)) {
      return false;
    }
    var parts = str.split('.').sort(function (a, b) {
      return a - b;
    });
    var lastPart = parts[3].split('/');
    return parts[2] <= 255 && lastPart[0] <= 255 && lastPart[1] <= 32;
  } else if (version === '6') {
    // This part needs a solution
    return false;
  }
  return false;
}
module.exports = exports['default'];