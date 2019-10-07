"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCamelCase;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isCamelCase(str) {
  (0, _assertString.default)(str);
  var pattern = /^[a-z]+(?:[A-Z][a-z]+)+$/;
  return pattern.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;