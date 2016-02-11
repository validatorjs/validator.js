"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHalfWidth;
var halfWidth = exports.halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

function isHalfWidth(str) {
  return halfWidth.test(str);
}