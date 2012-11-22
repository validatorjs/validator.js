
// Helper function to avoid duplication of code
function toDateTime(date) {
    if (date instanceof Date) {
        return date;
    }
    var intDate = Date.parse(date);
    if (isNaN(intDate)) {
        return null;
    }
    return new Date(intDate);
}

// Convert to date without the time component
function toDate(date) {
    if (!(date instanceof Date)) {
        date = toDateTime(date);
    }
    if (!date) {
        return null;
    }
    return date;
}

var validators = module.exports = {
    isEmail: function(str) {
        return str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
    },
    isUrl: function(str) {
        //A modified version of the validator from @diegoperini / https://gist.github.com/729294
        return str.length < 2083 && str.match(/^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i);
    },
    //node-js-core
    isIP : function(str) {
        if (!str) {
            return 0;
        } else if (/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/.test(str)) {
            var parts = str.split('.');
            for (var i = 0; i < parts.length; i++) {
                var part = parseInt(parts[i]);
                if (part < 0 || 255 < part) {
                    return 0;
                }
            }
            return 4;
        } else if (/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/.test(
            str)) {
            return 6;
        } else {
            return 0;
        }
    },
    //node-js-core
    isIPv4 : function(str) {
        return validators.isIP(str) === 4;
    },
    //node-js-core
    isIPv6 : function(str) {
        return validators.isIP(str) === 6;
    },
    isIPNet: function(str) {
        return validators.isIP(str) !== 0;
    },
    isAlpha: function(str) {
        return str.match(/^[a-zA-Z]+$/);
    },
    isAlphanumeric: function(str) {
        return str.match(/^[a-zA-Z0-9]+$/);
    },
    isNumeric: function(str) {
        return str.match(/^-?[0-9]+$/);
    },
    isLowercase: function(str) {
        return str.match(/^[a-z0-9]+$/);
    },
    isUppercase: function(str) {
        return str.match(/^[A-Z0-9]+$/);
    },
    isInt: function(str) {
        var floatVal = parseFloat(str)
            , intVal = parseInt(str * 1, 10);
        if(!isNaN(intVal) && (floatVal == intVal)) {
            return true;
        } else {
            return false;
        }
    },
    isDecimal: function(str) {
        return str !== '' && str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/);
    },
    isDivisibleBy: function(str, n) {
        return !(parseFloat(str) % n);
    },
    notNull: function(str) {
        return str !== '';
    },
    isNull: function(str) {
        return str === '';
    },
    notEmpty: function(str) {
        return !str.match(/^[\s\t\r\n]*$/);
    },
    equals: function(a, b) {
        return a == b;
    },
    contains: function(str, elem) {
        return str.indexOf(elem) >= 0;
    },
    notContains: function(str, elem) {
        return !validators.contains(str, elem);
    },
    regex: function(str, pattern, modifiers) {
        str += '';
        if (Object.prototype.toString.call(pattern).slice(8, -1) !== 'RegExp') {
            pattern = new RegExp(pattern, modifiers);
        }
        return str.match(pattern);
    },
    notRegex: function(str, pattern, modifiers) {
        return !validators.regex(str, pattern, modifiers);
    },
    len: function(str, min, max) {
        return str.length >= min && (max === undefined || str.length <= max);
    },
    //Thanks to github.com/sreuter for the idea.
    isUUID: function(str, version) {
        var pattern;
        if (version == 3 || version == 'v3') {
            pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
        } else if (version == 4 || version == 'v4') {
            pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        } else {
            pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
        }
        return str.match(pattern);
    },
    isDate: function(str) {
        var intDate = Date.parse(str);
        return !isNaN(intDate);
    },
    isAfter: function(str, date) {
        date = date || new Date();
        var origDate = toDate(str);
        var compDate = toDate(date);
        return !(origDate && compDate && origDate <= compDate);
    },
    isBefore: function(str, date) {
        date = date || new Date();
        var origDate = toDate(str);
        var compDate = toDate(date);
        return !(origDate && compDate && origDate >= compDate);
    },
    isIn: function(str, options) {
        var validOptions = options && typeof options.indexOf === 'function';
        return validOptions && ~options.indexOf(str);
    },
    notIn: function(str, options) {
        var validOptions = options && typeof options.indexOf === 'function';
        return validOptions && options.indexOf(str) === -1;
    },
    min: function(str, val) {
        var number = parseFloat(str);
        return isNaN(number) || number >= val;
    },
    max: function(str, val) {
        var number = parseFloat(str);
        return isNaN(number) || number <= val;
    },
    isArray: function(str) {
        return typeof str === 'object' && Object.prototype.toString.call(str) === '[object Array]';
    },
    //Will work against Visa, MasterCard, American Express, Discover, Diners Club, and JCB card numbering formats
    isCreditCard: function(str) {
        //remove all dashes, spaces, etc.
        var sanitized = str.replace(/[^0-9]+/g, '');
        if (sanitized.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/) === null) {
            return null;
        }
        // Doing Luhn check
        var sum = 0;
        var digit;
        var tmpNum;
        var shouldDouble = false;
        for (var i = sanitized.length - 1; i >= 0; i--) {
            digit = sanitized.substring(i, (i + 1));
            tmpNum = parseInt(digit, 10);
            if (shouldDouble) {
                tmpNum *= 2;
                if (tmpNum >= 10) {
                    sum += ((tmpNum % 10) + 1);
                }
                else {
                    sum += tmpNum;
                }
            }
            else {
                sum += tmpNum;
            }
            if (shouldDouble) {
                shouldDouble = false;
            }
            else {
                shouldDouble = true;
            }
        }
        if ((sum % 10) === 0) {
            return sanitized;
        } else {
            return null;
        }
    }
};
