var util = require('util');
var validators = require('./validators');
exports.defaultError = require('./defaultError');

var ValidatorError = exports.ValidatorError = function(msg) {
    Error.captureStackTrace(this, this);
    this.name = 'ValidatorError';
    this.message = msg;
};
util.inherits(ValidatorError, Error);

var Validator = exports.Validator = function() {}

Validator.prototype.error = function (msg) {
    throw new ValidatorError(msg);
};

Validator.prototype.check = function(str, fail_msg) {
    if (typeof str === 'object' && str !== null && str.toString) {
        str = str.toString();
    }
    this.str = (str == null || (isNaN(str) && str.length == undefined)) ? '' : str;
    if (typeof this.str == 'number') {
        this.str += '';
    }

    // This is a key, value pair of error messages to use
    if (typeof fail_msg === 'object') {
        this.errorDictionary = fail_msg;
        this.msg = null
    }
    else {
        this.errorDictionary = {};
        this.msg = fail_msg;
    }

    this._errors = this._errors || [];
    return this;
}

for (var key in validators) {
    if (validators.hasOwnProperty(key)) {
        (function (key) {
            Validator.prototype[key] = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this.str);
                if(!validators[key].apply(this, args)) {
                    var msg = exports.defaultError[key];
                    if (key in this.errorDictionary) {
                        msg = this.errorDictionary[key];
                    } else if (this.msg !== null && typeof this.msg !== 'undefined') {
                        msg = this.msg;
                    }
                    if (typeof msg === 'string') {
                        args.forEach(function(arg, i) { msg = msg.replace('%'+i, arg); });
                    }
                    return this.error(msg);
                }
                return this;
            };
        })(key);
    }
}

//Create some aliases - may help code readability
Validator.prototype.validate = Validator.prototype.check;
Validator.prototype.assert = Validator.prototype.check;
Validator.prototype.isFloat = Validator.prototype.isDecimal;
Validator.prototype.is = Validator.prototype.regex;
Validator.prototype.not = Validator.prototype.notRegex;
