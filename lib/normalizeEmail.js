'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeEmail;

var _isEmail = require('./isEmail');

var _isEmail2 = _interopRequireDefault(_isEmail);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_normalize_email_options = {
  lowercase: true,
  remove_dots: true,
  remove_extension: true
};

function normalizeEmail(email, options) {
  options = (0, _merge2.default)(options, default_normalize_email_options);
  if (!(0, _isEmail2.default)(email)) {
    return false;
  }
  var parts = email.split('@', 2);
  parts[1] = parts[1].toLowerCase();
  if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
    if (options.remove_extension) {
      parts[0] = parts[0].split('+')[0];
    }
    if (options.remove_dots) {
      parts[0] = parts[0].replace(/\./g, '');
    }
    if (!parts[0].length) {
      return false;
    }
    parts[0] = parts[0].toLowerCase();
    parts[1] = 'gmail.com';
  } else if (options.lowercase) {
    parts[0] = parts[0].toLowerCase();
  }
  return parts.join('@');
}
module.exports = exports['default'];