'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMobilePhone;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var fixPhones = {
  'fr-FR': /^(\+?33|0)[12345]\d{8}$/
}
/* eslint-enable max-len */

function isMobilePhone(str, locale) {
  (0, _assertString2.default)(str);
  if (locale in fixPhones) {
    return fixPhones[locale].test(str);
  } else if (locale === 'any') {
    return !!Object.values(fixPhones).find(function (phone) {
      return phone.test(str);
    });
  }
  throw new Error('Invalid locale \'' + locale + '\'');
}

module.exports = exports['default'];