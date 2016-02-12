'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = assertString;
function assertString(input) {
  if (typeof input !== 'string') {
    if (true) {
      require('depd')('validator')('you tried to validate a ' + (typeof input === 'undefined' ? 'undefined' : _typeof(input)) + ' but this library ' + '(validator.js) validates strings only.');
    }
    throw new Error('this library validates strings only');
  }
}
module.exports = exports['default'];