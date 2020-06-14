"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPermutation;

/* eslint-disable no-plusplus */
function isPermutation(str, pattern) {
  var m = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  pattern.split('').forEach(function (c) {
    if (!m[c]) m[c] = 0;
    ++m[c];
  });
  var N = str.length,
      K = pattern.length,
      i = 0,
      j = 0,
      need = K;

  while (j < N) {
    if (m[str[j]]-- > 0 && ! --need) return true;

    if (++j - i === K) {
      if (++m[str[i]] > 0) ++need;
      ++i;
    }
  }

  return false;
}

module.exports = exports.default;
module.exports.default = exports.default;