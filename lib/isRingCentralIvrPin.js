"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRingCentralIvrPin;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ivrPinRegex = new RegExp(/(012|123|234|345|456|567|678|789|987|876|765|654|543|432|210|000|111|222|333|444|555|666|777|888|999)/, 'i');

function isRingCentralIvrPin(str) {
  (0, _assertString.default)(str);
  return !ivrPinRegex.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;