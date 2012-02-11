var net = require('net');

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
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

var validators = module.exports = {
    isEmail: function(str) {
        return str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
    },
    isUrl: function(str) {
        return str.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i) || str.length > 2083;
    },
    isIP: function(str) {
        // net.isIp requires node >= 0.3.0
        var modernNode = typeof net.isIP === 'function';
        var method = modernNode? validators.isIPNet : validators.isIPManual;
        return method(str);
    },
    isIPNet: function(str) {
        return net.isIP(str) !== 0;
    },
    isIPManual: function(str) {
        return str.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
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
        return str.match(/^(?:-?(?:[0-9][0-9]*)(?:\.?0+)?)$/);
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
        if (typeof pattern !== 'function') {
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
        if (version == 3 || version == 'v3') {
            pattern = /[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
        } else if (version == 4 || version == 'v4') {
            pattern = /[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        } else {
            pattern = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
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
        return !(origDate && compDate && origDate < compDate);
    },
    isBefore: function(str, date) {
        date = date || new Date();
        var origDate = toDate(str);
        var compDate = toDate(date);
        return !(origDate && compDate && origDate > compDate);
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
        return sanitized.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/);
    }
};
