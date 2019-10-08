"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isLeapYear;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isLeapYear(str) {
  (0, _assertString.default)(str);
  var isValidPositiveNumber = !isNaN(str) && parseInt(str, 10) > 0;
  return isValidPositiveNumber ? str % 4 === 0 && str % 100 !== 0 || str % 400 === 0 : isValidPositiveNumber;
}

module.exports = exports.default;
module.exports.default = exports.default;