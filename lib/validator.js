var net = require('net');

var validators = {
    isEmail: function(str) {
        return str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
    },
    isUrl: function(str) {
        return str.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i) || str.length > 2083;
    },
    isIp: function(str) {
        // net.isIp requires node >= 0.3.0
        var modernNode = typeof net.isIP === 'function';
        var method = modernNode? this.isIpNet : this.isIpManual;
        return method(str);
    },
    isIpNet: function(str) {
        return net.isIP(str) !== 0;
    },
    isIpManual: function(str) {
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
    isEmpty: function(str) {
        return !str.match(/^[\s\t\r\n]*$/);
    },
    equals: function(a, b) {
        return a == b;
    },
    contains: function(str, elem) {
        return str.indexOf(elem) >= 0;
    },
    notContains: function(str, elem) {
        return !this.contains(str, elem);
    },
    regex: function(str, pattern, modifiers) {
        if (typeof pattern !== 'function') {
            pattern = new RegExp(pattern, modifiers);
        }
        return str.match(pattern);
    },
    notRegex: function(str, pattern, modifiers) {
        return !this.regex(str, pattern, modifiers);
    },
    isUUID: function(str, version) {
        if (version == 3 || version == 'v3') {
            pattern = /[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
        } else if (version == 4 || version == 'v4') {
            pattern = /[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        } else {
            pattern = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
        }
        return str.match(pattern);
    }
};

var Validator = exports.Validator = function() {}

Validator.prototype.check = function(str, fail_msg) {
    this.str = (str == null || (isNaN(str) && str.length == undefined)) ? '' : str;
    // Convert numbers to strings but keep arrays/objects
    if (typeof this.str == 'number') {
      this.str += '';
    }
    this.msg = fail_msg;
    this._errors = this._errors || [];
    return this;
}

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

//Create some aliases - may help code readability
Validator.prototype.validate = Validator.prototype.check;
Validator.prototype.assert = Validator.prototype.check;

Validator.prototype.error = function(msg) {
    throw new Error(msg);
    return this;
}

Validator.prototype.isEmail = function() {
    if (!validators.isEmail(this.str)) {
       return this.error(this.msg || 'Invalid email');
    }
    return this;
}

Validator.prototype.isUrl = function() {
    if (!validators.isUrl(this.str)) {
       return this.error(this.msg || 'Invalid URL');
    }
    return this;
}

Validator.prototype.isIP = function() {
    //net.isIP is in node >= 0.3.0
    if (!validators.isIp(this.str)) {
       return this.error(this.msg || 'Invalid IP');
    }
    return this;
}

Validator.prototype.isAlpha = function() {
    if (!validators.isAlpha(this.str)) {
       return this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isAlphanumeric = function() {
    if (!validators.isAlphanumeric(this.str)) {
       return this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isNumeric = function() {
    if (!validators.isNumeric(this.str)) {
       return this.error(this.msg || 'Invalid number');
    }
    return this;
}

Validator.prototype.isLowercase = function() {
    if (!validators.isLowercase(this.str)) {
       return this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isUppercase = function() {
    if (!validators.isUppercase(this.str)) {
       return this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isInt = function() {
    if (!validators.isInt(this.str)) {
       return this.error(this.msg || 'Invalid integer');
    }
    return this;
}

Validator.prototype.isDecimal = function() {
    if (!validators.isDecimal(this.str)) {
        return this.error(this.msg || 'Invalid decimal');
    }
    return this;
}

Validator.prototype.isFloat = function() {
    return this.isDecimal();
}

Validator.prototype.isDivisibleBy = function(n) {
    if (!validators.isDivisibleBy(this.str, n)) {
        return this.error(this.msg || 'Not divisible by ' + n);
    }
    return this;
}

Validator.prototype.notNull = function() {
    if (!validators.notNull(this.str)) {
       return this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isNull = function() {
    if (!validators.isNull(this.str)) {
       return this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.notEmpty = function() {
    if (!validators.isEmpty(this.str)) {
       return this.error(this.msg || 'String is empty');
    }
    return this;
}

Validator.prototype.equals = function(equals) {
    if (!validators.equals(this.str, equals)) {
        return this.error(this.msg || 'Not equal');
    }
    return this;
}

Validator.prototype.contains = function(elem) {
    if (!validators.contains(this.str, elem)) {
       return this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.notContains = function(elem) {
    if (!validators.notContains(this.str, elem)) {
        return this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.regex = Validator.prototype.is = function(pattern, modifiers) {
    if (!validators.regex(this.str, pattern, modifiers)) {
        return this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.notRegex = Validator.prototype.not = function(pattern, modifiers) {
    if (!validators.notRegex(this.str, pattern, modifiers)) {
       return this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.len = function(min, max) {
    if (this.str.length < min) {
       return this.error(this.msg || 'String is too small');
    }
    if (typeof max !== undefined && this.str.length > max) {
       return this.error(this.msg || 'String is too large');
    }
    return this;
}

//Thanks to github.com/sreuter for the idea.
Validator.prototype.isUUID = function(version) {
    if (!validators.isUUID(this.str, version)) {
       return this.error(this.msg || 'Not a UUID');
    }
    return this;
}

Validator.prototype.isDate = function() {
    var intDate = Date.parse(this.str);
    if (isNaN(intDate)) {
        return this.error(this.msg || 'Not a date');
    }
    return this;
}

Validator.prototype.isAfter = function(date) {
    date = date || new Date();
    var origDate = toDate(this.str);
    var compDate = toDate(date);

    if (origDate && compDate && origDate < compDate) {
        return this.error(this.msg || 'Invalid date');
    }

    return this;
}

Validator.prototype.isBefore = function(date) {
    date = date || new Date();
    var origDate = toDate(this.str);
    var compDate = toDate(date);

    if (origDate && compDate && origDate > compDate) {
        return this.error(this.msg || 'Invalid date');
    }

    return this;
}

Validator.prototype.isIn = function(options) {
    if (options && typeof options.indexOf === 'function') {
        if (!~options.indexOf(this.str)) {
            return this.error(this.msg || 'Unexpected value');
        }
        return this;
    } else {
        return this.error(this.msg || 'Invalid in() argument');
    }
}

Validator.prototype.notIn = function(options) {
    if (options && typeof options.indexOf === 'function') {
        if (options.indexOf(this.str) !== -1) {
            return this.error(this.msg || 'Unexpected value');
        }
        return this;
    } else {
        return this.error(this.msg || 'Invalid notIn() argument');
    }
}

Validator.prototype.min = function(val) {
    var number = parseFloat(this.str);

    if (!isNaN(number) && number < val) {
        return this.error(this.msg || 'Invalid number');
    }
    return this;
}

Validator.prototype.max = function(val) {
    var number = parseFloat(this.str);

    if (!isNaN(number) && number > val) {
        return this.error(this.msg || 'Invalid number');
    }
    return this;
}

Validator.prototype.isArray = function() {
    if (!Array.isArray(this.str)) {
        return this.error(this.msg || 'Not an array');
    }
    return this;
}

//Will work against Visa, MasterCard, American Express, Discover, Diners Club, and JCB card numbering formats
Validator.prototype.isCreditCard = function() {
    this.str = this.str.replace(/[^0-9]+/g, ''); //remove all dashes, spaces, etc.
    if (!this.str.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
        return this.error(this.msg || 'Invalid credit card');
    }
    return this;
}

