"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validatePassword;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validatePassword(str) {
  var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  (0, _assertString.default)(str);
  return /[a-z]/.test(str) && /[A-Z]/.test(str) && /[\d]/.test(str) && format.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;