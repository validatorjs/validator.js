'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMACAddress;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Common SQL reserved words match;
var pattern1 = /\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION|LIKE|JOIN|WHERE( +ALL){0,1})\b/gi;

// where 1=1 like match
var pattern2 = /[ \t]+(and|OR|OR|AND)[ \t]+[-\+]?[ \t]*[0-9\.]+[ \t]*[<>=!]{1,2}[ \t]*[-\+]?[ \t]*[0-9\.]+/gi;

function isMACAddress(str) {
  (0, _assertString2.default)(str);
  return pattern1.test(str) || pattern2.test(str);
}
module.exports = exports['default'];