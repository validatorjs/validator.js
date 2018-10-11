'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isJWT;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = /^([A-Za-z0-9\-_~+\/]+[=]{0,2})\.([A-Za-z0-9\-_~+\/]+[=]{0,2})(?:\.([A-Za-z0-9\-_~+\/]+[=]{0,2}))?$/;

function isJWT(str) {
  (0, _assertString2.default)(str);
  return jwt.test(str);
}
module.exports = exports['default'];