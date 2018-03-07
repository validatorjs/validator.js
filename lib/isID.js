'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isID;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var IDS = {
  'es-ES': function esES(str) {
    var spanishID = /(\d{8})(\s|-)?([a-zA-Z]{1})$/;
    var isValidFormat = spanishID.test(str);
    if (!isValidFormat) {
      return false;
    }
    var letter = str[str.length - 1];
    var encoder = 'TRWAGMYFPDXBNJZSQVHLCKE';
    var sum = str.replace(/[ a-zA-Z_-]+/, '').split('').reduce(function (acc, digit) {
      return acc + Number(digit);
    });

    return letter.toUpperCase() === encoder[sum % 23];
  },
  'ko-KR': function koKR(str) {
    var birth = str.match(/^(\d{2})(\d{2})(\d{2})\-?([1-4])\d{6}$/);
    if (!birth) {
      return false;
    }

    var bd_txt = (birth[4] > 2 ? '20' : '19') + birth[1] + '/' + parseInt(birth[2], 10) + '/' + parseInt(birth[3], 10);
    var bd = new Date(bd_txt);
    var new_bd_txt = bd.getFullYear() + '/' + (bd.getMonth() + 1) + '/' + bd.getDate();
    var bd_check = bd_txt === new_bd_txt;
    if (!bd_check) {
      return false;
    }

    str = str.replace(/\-/g, '');
    var len = str.length;
    if (len !== 13) {
      return false;
    }
    var ck = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    var result = 0;
    for (var i = 0; i < str.length - 1; i++) {
      result += parseInt(str.charAt(i), 10) * ck[i];
    }
    result = (11 - result % 11) % 10;
    if (result === parseInt(str.charAt(12), 10)) {
      return true;
    }
    return false;
  },
  'zh-CN': function zhCN(str) {
    str = str.toUpperCase().replace(/[^0-9X]/g, '');
    var len = str.length;
    if (len !== 18) {
      return false;
    }

    var city_code = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65, 71, 81, 82, 91];
    if (city_code.indexOf[parseInt(str.substr(0, 2), 10)] === -1) {
      return false;
    }

    var birth = str.match(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
    if (!birth) {
      return false;
    }

    var bd_txt = birth[2] + '/' + parseInt(birth[3], 10) + '/' + parseInt(birth[4], 10);
    var bd = new Date(bd_txt);
    var new_bd_txt = bd.getFullYear() + '/' + (bd.getMonth() + 1) + '/' + bd.getDate();
    console.log(bd_txt, new_bd_txt);
    var bd_check = bd_txt === new_bd_txt;
    if (!bd_check) {
      return false;
    }

    var result = 0;
    var ckint = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var ck = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    for (var i = 0; i < 17; i++) {
      result += str.substr(i, 1) * ckint[i];
    }
    result = ck[result % 11];
    if (result === str.substr(17, 1)) {
      return true;
    }

    return false;
  }
};
/* eslint-enable max-len */

function isID(str, locale) {
  (0, _assertString2.default)(str);
  if (locale in IDS) {
    if (typeof IDS[locale] === 'function') {
      return IDS[locale](str);
    }
    return IDS[locale].test(str);
  }
  throw new Error('Invalid locale \'' + locale + '\'');
}
module.exports = exports['default'];