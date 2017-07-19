'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDecimal;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var decimal = /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/;

function isDecimal(str, options) {
  (0, _assertString2.default)(str);
  options = options || {};
  return str !== '' && decimal.test(str) && (!options.hasOwnProperty('digitsAfterDecPoint') || str.indexOf('.') === -1 || str.length - str.indexOf('.') - 1 <= options.digitsAfterDecPoint);
}
module.exports = exports['default'];