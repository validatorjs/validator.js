"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isTwitterHandle;
var twitterHandle = /^(?=.*[a-zA-Z]|[0-9]*_+[0-9]*)[a-zA-Z0-9_]{5,15}$/;

function isTwitterHandle(username) {
  return twitterHandle.test(username);
}

module.exports = exports.default;
module.exports.default = exports.default;