"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIdentityCard;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }




var validators = {
  ES: function ES(str) {
    (0, _assertString.default)(str);
    var DNI = /^[0-9X-Z][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    var charsValue = {
      X: 0,
      Y: 1,
      Z: 2
    };
    var controlDigits = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E']; // sanitize user input

    var sanitized = str.trim().toUpperCase(); // validate the data structure

    if (!DNI.test(sanitized)) {
      return false;
    } // validate the control digit


    var number = sanitized.slice(0, -1).replace(/[X,Y,Z]/g, function (char) {
      return charsValue[char];
    });
    return sanitized.endsWith(controlDigits[number % 23]);
  },
  'he-IL': function heIL(str) {
    var DNI = /^\d{9}$/; // sanitize user input

    var sanitized = str.trim(); // validate the data structure

    if (!DNI.test(sanitized)) {
      return false;
    }

    var id = sanitized;
    var sum = 0,
      incNum;

    for (var i = 0; i < id.length; i++) {
      incNum = Number(id[i]) * (i % 2 + 1); // Multiply number by 1 or 2

      sum += incNum > 9 ? incNum - 9 : incNum; // Sum the digits up and add to total
    }

    return sum % 10 === 0;
  },
  'zh-CN': function zhCN(str) {
    return zhCNidCardNoValidator.checkIdCardNo(str)
  },
  'zh-TW': function zhTW(str) {
    var ALPHABET_CODES = {
      A: 10,
      B: 11,
      C: 12,
      D: 13,
      E: 14,
      F: 15,
      G: 16,
      H: 17,
      I: 34,
      J: 18,
      K: 19,
      L: 20,
      M: 21,
      N: 22,
      O: 35,
      P: 23,
      Q: 24,
      R: 25,
      S: 26,
      T: 27,
      U: 28,
      V: 29,
      W: 32,
      X: 30,
      Y: 31,
      Z: 33
    };
    var sanitized = str.trim().toUpperCase();
    if (!/^[A-Z][0-9]{9}$/.test(sanitized)) return false;
    return Array.from(sanitized).reduce(function (sum, number, index) {
      if (index === 0) {
        var code = ALPHABET_CODES[number];
        return code % 10 * 9 + Math.floor(code / 10);
      }

      if (index === 9) {
        return (10 - sum % 10 - Number(number)) % 10 === 0;
      }

      return sum + Number(number) * (9 - index);
    }, 0);
  }
};

function isIdentityCard(str, locale) {
  (0, _assertString.default)(str);

  if (locale in validators) {
    return validators[locale](str);
  } else if (locale === 'any') {
    for (var key in validators) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if (validators.hasOwnProperty(key)) {
        var validator = validators[key];

        if (validator(str)) {
          return true;
        }
      }
    }

    return false;
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}


var zhCNidCardNoValidator = {
  provinceAndCitys: { 11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外' },


  powers: ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'],


  parityBit: ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'],


  checkAddressCode: function (addressCode) {
    var check = /^[1-9]\d{5}$/.test(addressCode)
    if (!check) return false
    if (zhCNidCardNoValidator.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
      return true
    } else {
      return false
    }
  },


  checkBirthDayCode: function (birDayCode) {
    var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode)
    if (!check) return false
    var yyyy = parseInt(birDayCode.substring(0, 4), 10)
    var mm = parseInt(birDayCode.substring(4, 6), 10)
    var dd = parseInt(birDayCode.substring(6), 10)
    var xdata = new Date(yyyy, mm - 1, dd)
    if (xdata > new Date()) {
      return false
    } else if ((xdata.getFullYear() === yyyy) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === dd)) {
      return true
    } else {
      return false
    }
  },


  getParityBit: function (idCardNo) {
    var id17 = idCardNo.substring(0, 17)

    var power = 0
    for (var i = 0; i < 17; i++) {
      power += parseInt(id17.charAt(i), 10) * parseInt(zhCNidCardNoValidator.powers[i])
    }

    var mod = power % 11
    return zhCNidCardNoValidator.parityBit[mod]
  },

  checkParityBit: function (idCardNo) {
    var parityBit = idCardNo.charAt(17).toUpperCase()
    if (zhCNidCardNoValidator.getParityBit(idCardNo) === parityBit) {
      return true
    } else {
      return false
    }
  },


  checkIdCardNo: function (idCardNo) {

    var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo)
    if (!check) return false
    if (idCardNo.length === 15) {
      return zhCNidCardNoValidator.check15IdCardNo(idCardNo)
    } else if (idCardNo.length === 18) {
      return zhCNidCardNoValidator.check18IdCardNo(idCardNo)
    } else {
      return false
    }
  },

  check15IdCardNo: function (idCardNo) {
    var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo)
    if (!check) return false
    var addressCode = idCardNo.substring(0, 6)
    check = zhCNidCardNoValidator.checkAddressCode(addressCode)
    if (!check) return false
    var birDayCode = '19' + idCardNo.substring(6, 12)
    check = zhCNidCardNoValidator.checkBirthDayCode(birDayCode)
    if (!check) return false
    return zhCNidCardNoValidator.checkParityBit(idCardNo)
  },

  check18IdCardNo: function (idCardNo) {
    var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo)
    if (!check) return false
    var addressCode = idCardNo.substring(0, 6)
    check = zhCNidCardNoValidator.checkAddressCode(addressCode)
    if (!check) return false
    var birDayCode = idCardNo.substring(6, 14)
    check = zhCNidCardNoValidator.checkBirthDayCode(birDayCode)
    if (!check) return false
    return zhCNidCardNoValidator.checkParityBit(idCardNo)
  }
}

module.exports = exports.default;
module.exports.default = exports.default;

