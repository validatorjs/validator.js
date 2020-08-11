"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRingCentralPassword;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])\S{8,}$/, '');

function isRingCentralPassword(str) {
  (0, _assertString.default)(str);
  return passwordRegex.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;