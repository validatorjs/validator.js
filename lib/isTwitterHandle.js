"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isTwitterHandle;
var twitterHandle = /^(?=.*[A-z]|[\d]*_+[\d]*)[\w_]{5,15}$/;

function isTwitterHandle(username) {
  return twitterHandle.test(username);
}

module.exports = exports.default;
module.exports.default = exports.default;