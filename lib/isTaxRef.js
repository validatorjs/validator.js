'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isTaxRef;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var references = {
  UK: /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/
};
/* eslint-enable max-len */

function isTaxRef(str, locale) {
  (0, _assertString2.default)(str);
  if (locale in references) {
    return references[locale].test(str);
  } else if (locale === 'any') {
    for (var key in references) {
      if (references.hasOwnProperty(key)) {
        var reference = references[key];
        if (reference.test(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error('Invalid locale \'' + locale + '\'');
}
module.exports = exports['default'];