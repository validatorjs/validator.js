"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isStrongPassword;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isStrongPassword(str
  (0, _assertString.default)(str);
  return str === str.toUpperCase();
}