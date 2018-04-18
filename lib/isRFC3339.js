'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRFC3339;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var rfc3339 = /^[0-9]{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])[ tT]([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?([zZ]|[-+]([01][0-9]|2[0-3]):[0-5][0-9])$/;
/* eslint-enable max-len */

function isRFC3339(str) {
  (0, _assertString2.default)(str);
  return rfc3339.test(str);
}
module.exports = exports['default'];