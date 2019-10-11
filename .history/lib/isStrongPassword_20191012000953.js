"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isStrongPassword;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isStrongPassword(str) {
  (0, _assertString.default)(str);
  var count = 0;
  ​​​
  for (var ​i = 0; i<str.length; i++) {
    if (str[i] !== str[i].toUpperCase() && str[i] === str[i].toLowerCase()) {
      ++count;
    }
  }​
  return str === str.toUpperCase();
}