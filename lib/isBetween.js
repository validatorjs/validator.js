"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBetween;

function isBetween(val, options) {
  if (typeof options.min !== 'number' && typeof options.max !== 'number') {
    throw new Error('Range must be of type number');
  }

  if (options.min >= options.max) {
    throw new Error('First value must be less than sencond in range.');
  }

  if (typeof val !== 'string' && typeof val !== 'number' && !Array.isArray(val)) {
    throw new Error('Value must be type Array, Number or String');
  }

  if (typeof val === 'number') {
    return options.min <= val && val <= options.max;
  }

  var len = val.length;
  return options.min <= len && len <= options.max;
}

module.exports = exports.default;
module.exports.default = exports.default;