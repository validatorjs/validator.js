"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toDate;

var _asserts = require("./util/asserts");

function toDate(date) {
  (0, _asserts.assertStringOrNumber)(date);

  if (!date) {
    return date;
  }

  if (typeof date === 'number') {
    date = String(date);
  }

  if (typeof date === 'string' && /^\d+$/.test(date)) {
    if (date.length === 10) {
      date += '000';
    }

    date = new Date(Number(date));
  } else {
    date = Date.parse(date);
  }

  return !isNaN(date) ? new Date(date) : null;
}

console.log(toDate('04 Dec 1995 00:12:00 GMT'));
console.log(toDate('1549012444'));
console.log(toDate('1549012444000'));
console.log(toDate(1549012444));
console.log(toDate(1549012444000));
module.exports = exports.default;
module.exports.default = exports.default;