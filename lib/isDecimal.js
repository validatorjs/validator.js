'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDecimal;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _alpha = require('./alpha');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isDecimal(str) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';

  (0, _assertString2.default)(str);
  if (locale in _alpha.decimal) {
    var decimalRegExp = new RegExp('^[-+]?([0-9]+|\\' + _alpha.decimal[locale] + '[0-9]+|[0-9]+\\' + _alpha.decimal[locale] + '[0-9]+)$');
    return str !== '' && decimalRegExp.test(str);
  }
  throw new Error('Invalid locale \'' + locale + '\'');
}
module.exports = exports['default'];