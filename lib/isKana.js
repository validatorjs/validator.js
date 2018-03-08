'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kana_patterns = undefined;
exports.default = isKana;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var kana_patterns = exports.kana_patterns = {
  hiragana: /^[\u3041-\u3096\u3099-\u309A\u309D-\u309F]+$/,
  katakana: /^[\u30A0-\u30FF]+$/,
  'half-katakana': /^[\uFF61-\uFF9F]+$/
};

function isKana(str, kana_type) {
  (0, _assertString2.default)(str);
  if (kana_type in kana_patterns) {
    return kana_patterns[kana_type].test(str);
  }
  throw new Error('Invalid Kana type \'' + kana_type + '\'');
}