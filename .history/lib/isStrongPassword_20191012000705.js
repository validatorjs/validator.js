"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isStrongPassword;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isStrongPassword(str) {
  (0, _assertString.default)(str);
  ​​​
  for (var ​i = 0; i<str.length; i++) {
    if (letters[i] !== letters[i].toUpperCase()
        && letters[i] === letters[i].toLowerCase()) {
        console.log(letters[i] + ": " + true);
    } else {
        console.log(letters[i] + ": " + false);
    }
}​
  return str === str.toUpperCase();
}