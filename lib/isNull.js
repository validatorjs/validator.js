'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNull;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isNull(str) {
  (0, _assertString2.default)(str);
  return str.length === 0;
}
module.exports = exports['default'];