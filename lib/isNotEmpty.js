'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNotEmpty;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _isEmpty = require('./isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isNotEmpty(str) {
  (0, _assertString2.default)(str);
  return !(0, _isEmpty2.default)(str);
}
module.exports = exports['default'];