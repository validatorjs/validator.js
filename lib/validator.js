var validators = require('./validators');

var defaultError = {
    isEmail: 'Invalid email',
    isUrl: 'Invalid URL',
    isIP: 'Invalid IP',
    isAlpha: 'Invalid characters',
    isAlphanumeric: 'Invalid characters',
    isNumeric: 'Invalid number',
    isLowercase: 'Invalid characters',
    isUppercase: 'Invalid characters',
    isInt: 'Invalid integer',
    isDecimal: 'Invalid decimal',
    isDivisibleBy: 'Not divisible',
    notNull: 'Invalid characters',
    isNull: 'Invalid characters',
    notEmpty: 'String is empty',
    equals: 'Not equal',
    contains: 'Invalid characters',
    notContains: 'Invalid characters',
    regex: 'Invalid characters',
    notRegex: 'Invalid characters',
    len: 'String is not in range',
    isUUID: 'Not a UUID',
    isDate: 'Not a date',
    isAfter: 'Invalid date',
    isBefore: 'Invalid date',
    isIn: 'Unexpected value or invalid argument',
    notIn: 'Unexpected value or invalid argument',
    min: 'Invalid number',
    max: 'Invalid number',
    isArray: 'Not an array',
    isCreditCard: 'Invalid credit card'
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


//Create some aliases - may help code readability
Validator.prototype.validate = Validator.prototype.check;
Validator.prototype.assert = Validator.prototype.check;

Validator.prototype.error = function(msg) {
    throw new Error(msg);
    return this;
}

Object.keys(validators).forEach(function(key) {
    Validator.prototype[key] = function() {
        args = Array.prototype.slice.call(arguments);
        args.unshift(this.str);
        if(!validators[key].apply(this, args)) {
            return this.error(this.msg || defaultError[key]);
        }
        return this;
    };
});

Validator.prototype.isFloat = Validator.prototype.isDecimal;
Validator.prototype.is = Validator.prototype.regex;
Validator.prototype.not = Validator.prototype.notRegex;
