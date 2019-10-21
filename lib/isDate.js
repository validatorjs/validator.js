"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDate;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isDate(str) {
  (0, _assertString.default)(str);
  return (new Date(str) !== "Invalid Date") && !isNaN(new Date(str));
}

module.exports = exports.default;
module.exports.default = exports.default;