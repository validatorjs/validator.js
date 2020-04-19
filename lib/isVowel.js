"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isVowel;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vowels = 'aeiouAEIOU';

function isVowel(str) {
  (0, _assertString.default)(str); // catch cases like AE || aeiou

  if (str.length > 1) return false;
  return vowels.includes(str);
}

module.exports = exports.default;
module.exports.default = exports.default;