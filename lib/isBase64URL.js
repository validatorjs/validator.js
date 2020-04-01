"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBase64Url;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isBase64Url(str) {
  (0, _assertString.default)(str);
  return /^[A-Za-z0-9_-]+$/.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;