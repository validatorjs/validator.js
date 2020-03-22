"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDate;

function isDate(input) {
  if (typeof input === 'string') {
    return isFinite(Date.parse(input));
  }

  return Object.prototype.toString.call(input) === '[object Date]' && isFinite(input);
}

module.exports = exports.default;
module.exports.default = exports.default;