'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isSpanishDNI;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spanishDNI = /(\d{8})(\s|-)?([a-zA-Z]{1})$/;

function isSpanishDNI(str) {
  (0, _assertString2.default)(str);
  var isValidFormat = spanishDNI.test(str);
  if (!isValidFormat) {
    return false;
  }
  var letter = str[str.length - 1];
  var encoder = 'TRWAGMYFPDXBNJZSQVHLCKE';
  var sum = str.replace(/[ a-zA-Z_-]+/, '').split('').reduce(function (acc, digit) {
    return acc + Number(digit);
  });

  console.log(sum);

  return letter.toUpperCase() === encoder[sum % 23];
}
module.exports = exports['default'];