'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHex;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_ishex_options = {
  allow_transparent: true
};

function isHex(val, options) {
  (0, _assertString2.default)(val);
  options = (0, _merge2.default)(options, default_ishex_options);

  if (options.allow_transparent && val === 'transparent') {
    return true;
  }

  var startWithHex = val[0] === '#';

  if (!startWithHex) {
    return false;
  }

  var isCorrectLength = val.length === 4 || val.length === 7;

  if (isCorrectLength) {
    var regex = /[0-9a-f]/i;
    var valueSliced = val.slice(1).split('');
    var isValid = true;
    valueSliced.forEach(function (i) {
      if (i.match(regex) === null) {
        isValid = false;
      }
    });
    return isValid;
  }

  return false;
}
module.exports = exports['default'];