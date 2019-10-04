"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBitcoinAddress;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-control-regex */
var bitcoinregex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
/* eslint-enable no-control-regex */

function isBitcoinAddress(str) {
  (0, _assertString.default)(str);
  return bitcoinregex.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;