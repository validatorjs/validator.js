"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertStringOrNumber = assertStringOrNumber;
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function assertStringOrNumber(input) {
  var isStringOrNumber = typeof input === 'string' || input instanceof String || typeof input === 'number' || input instanceof Number;

  if (!isStringOrNumber) {
    var invalidType;

    if (input === null) {
      invalidType = 'null';
    } else {
      invalidType = _typeof(input);

      if (invalidType === 'object' && input.constructor && input.constructor.hasOwnProperty('name')) {
        invalidType = input.constructor.name;
      } else {
        invalidType = "a ".concat(invalidType);
      }
    }

    throw new TypeError("Expected string/number but received ".concat(invalidType, "."));
  }
}

var _default = assertStringOrNumber;
exports.default = _default;