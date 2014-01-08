var patterns = require('./patterns')
  , utils = require('./utils');

var validators = exports;

validators.isEmail = function (str) {
    return patterns.email.test(str);
};

validators.isUrl = function (str) {
    return str.length < 2083 && patterns.url.test(str);
};

validators.isIP = function (str) {
    if (validators.isIPv4(str)) {
        return 4;
    } else if (validators.isIPv6(str)) {
        return 6;
    }
    return false;
};

validators.isIPv4 = function (str) {
    if (!patterns.ipv4Maybe.test(str)) {
        return false;
    }
    var parts = str.split('.').sort();
    return parts[3] <= 255;
};

validators.isIPv6 = function (str) {
    return patterns.ipv6.test(str);
};

validators.isAlpha = function (str) {
    return patterns.alpha.test(str);
};

validators.isAlphanumeric = function (str) {
    return patterns.alphanumeric.test(str);
};

validators.isNumeric = function (str) {
    return patterns.numeric.test(str);
};

validators.isHexadecimal = function (str) {
    return patterns.hexadecimal.test(str);
};

validators.isHexColor = function (str) {
    return patterns.hexcolor.test(str);
};

validators.isLowercase = function (str) {
    return str === str.toLowerCase();
};

validators.isUppercase = function (str) {
    return str === str.toUpperCase();
};

validators.isInt = function (str) {
    return patterns.int.test(str);
};

validators.isFloat = function (str) {
    return str !== '' && patterns.float.test(str);
};

validators.isDivisibleBy = function (str, n) {
    return (parseFloat(str) % parseInt(n, 10)) === 0;
};

validators.notNull = function (str) {
    return str !== '';
};

validators.isNull = function (str) {
    return str === '';
};

validators.notEmpty = function (str) {
    return !patterns.empty.test(str);
};

validators.equals = function (a, b) {
    return a === utils.coerce(b);
};

validators.contains = function (str, elem) {
    return str.indexOf(elem) >= 0 && !!elem;
};

validators.notContains = function (str, elem) {
    return !validators.contains(str, elem);
};

validators.regex = function (str, pattern, modifiers) {
    str += '';
    if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
        pattern = new RegExp(pattern, modifiers);
    }
    return str.match(pattern);
};

validators.notRegex = function (str, pattern, modifiers) {
    return !validators.regex(str, pattern, modifiers);
};

validators.len = function (str, min, max) {
    return str.length >= min && (max === undefined || str.length <= max);
};

validators.isUUID = function (str, version) {
    var pattern;
    version = version + '';
    if (version === '3' || version === 'v3') {
        pattern = patterns.uuid.v3;
    } else if (version === '4' || version === 'v4') {
        pattern = patterns.uuid.v4;
    } else if (version === '5' || version === 'v5') {
        pattern = patterns.uuid.v5;
    } else {
        pattern = patterns.uuid.all;
    }
    return pattern.test(str);
};

validators.isUUIDv3 = function (str) {
    return validators.isUUID(str, 3);
};

validators.isUUIDv4 = function (str) {
    return validators.isUUID(str, 4);
};

validators.isUUIDv5 = function (str) {
    return validators.isUUID(str, 5);
};

validators.isDate = function (str) {
    var intDate = Date.parse(str);
    return !isNaN(intDate);
};

validators.isAfter = function (str, date) {
    var compDate = utils.toDate(date || new Date())
      , origDate = utils.toDate(str);
    return origDate && compDate && origDate > compDate;
};

validators.isBefore = function (str, date) {
    var compDate = utils.toDate(date || new Date())
      , origDate = utils.toDate(str);
    return origDate && compDate && origDate < compDate;
};

validators.isIn = function (str, options) {
    if (!options || typeof options.indexOf !== 'function') {
        return false;
    }
    if (Object.prototype.toString.call(options) === '[object Array]') {
        var array = [];
        for (var i = 0, len = options.length; i < len; i++) {
            array[i] = options[i] + '';
        }
        options = array;
    }
    return options.indexOf(str) >= 0;
};

validators.notIn = function (str, options) {
    if (!options || typeof options.indexOf !== 'function') {
        return false;
    }
    if (Object.prototype.toString.call(options) === '[object Array]') {
        var array = [];
        for (var i = 0, len = options.length; i < len; i++) {
            array[i] = options[i] + '';
        }
        options = array;
    }
    return options.indexOf(str) < 0;
};

validators.min = function (str, val) {
    var number = parseFloat(str);
    return isNaN(number) || number >= val;
};

validators.max = function (str, val) {
    var number = parseFloat(str);
    return isNaN(number) || number <= val;
};

validators.isCreditCard = function (str) {
    var sanitized = str.replace(patterns.notNumeric, '');
    if (!patterns.creditCard.test(sanitized)) {
        return false;
    }
    var sum = 0, digit, tmpNum, shouldDouble;
    for (var i = sanitized.length - 1; i >= 0; i--) {
        digit = sanitized.substring(i, (i + 1));
        tmpNum = parseInt(digit, 10);
        if (shouldDouble) {
            tmpNum *= 2;
            if (tmpNum >= 10) {
                sum += ((tmpNum % 10) + 1);
            } else {
                sum += tmpNum;
            }
        } else {
            sum += tmpNum;
        }
        shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0 ? sanitized : false;
};
