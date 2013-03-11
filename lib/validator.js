var util = require('util');
var validators = require('./validators');
exports.defaultError = require('./defaultError');

var ValidatorError = exports.ValidatorError = function(msg,field) {
    Error.captureStackTrace(this, this);
    this.name = 'ValidatorError';
    this.message = msg;
    this.field=field;
};
util.inherits(ValidatorError, Error);

var Validator = exports.Validator = function() {}

Validator.prototype.error = function (msg,field) {
    throw new ValidatorError(msg,field);
};

Validator.prototype.check = function(str, fail_msg, field) {
    this.str = (str == null || (isNaN(str) && str.length == undefined)) ? '' : str;
    if (typeof this.str == 'number') {
        this.str += '';
    }
    this.msg = fail_msg;
    this.field= field;
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
                    var msg = this.msg || exports.defaultError[key];
                    if (typeof msg === 'string') {
                        args.forEach(function(arg, i) { msg = msg.replace('%'+i, arg); });
                    }
                    return this.error(msg,this.field);
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
