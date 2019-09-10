"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISO6392;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isISO6392Reg = /^[a-z]{3}$/;

function isISO6392(str) {
  (0, _assertString.default)(str);
  return isISO6392Reg.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;