'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = isIPRange;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _isIP = require('./isIP');

var _isIP2 = _interopRequireDefault(_isIP);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subnetMaybe = /^\d{1,2}$/;

function isIPRange(str) {
  (0, _assertString2.default)(str);

  var rangeParts = str.split('/');

  if (rangeParts.length !== 2) {
    return false;
  }

  var _rangeParts = _slicedToArray(rangeParts, 2),
      ip = _rangeParts[0],
      subnet = _rangeParts[1];

  if (!subnetMaybe.test(subnet)) {
    return false;
  }

  // Disallow preceding 0 i.e. 01, 02, ...
  if (subnet.length > 1 && subnet.startsWith('0')) {
    return false;
  }

  return (0, _isIP2.default)(ip) && subnet <= 32 && subnet >= 0;
}
module.exports = exports['default'];