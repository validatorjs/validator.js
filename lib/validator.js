var validators = require('./validators')
  , defaultError = require('./defaultError')
  , utils = require('./utils');

function ValidatorError(message) {
    this.name = 'ValidatorError';
    this.message = message;
    this.stack = new Error().stack;
}

ValidatorError.prototype = new Error();
ValidatorError.prototype.constructor = ValidatorError;

function defaultMessageBuilder(msg, args) {
    if (typeof msg === 'string') {
        args.forEach(function (arg, i) {
            msg = msg.replace('%' + i, arg);
        });
    }
    return msg;
}

function Validator(options) {
    this.options = options || (options = {});
    options.messageBuilder = options.messageBuilder || defaultMessageBuilder;
}

Validator.prototype.error = function (msg) {
    throw new ValidatorError(msg);
};

Validator.prototype.check = function (str, fail_msg) {
    this.str = utils.coerce(str);
    if (typeof fail_msg === 'object') {
        this.errorDictionary = fail_msg;
        this.msg = null;
    } else {
        this.errorDictionary = {};
        this.msg = fail_msg;
    }
    return this;
};

for (var key in validators) {
    (function (key) {
        Validator.prototype[key] = function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this.str);
            if (!validators[key].apply(this, args)) {
                var msg = defaultError[key];
                if (key in this.errorDictionary) {
                    msg = this.errorDictionary[key];
                } else if (this.msg !== null && typeof this.msg !== 'undefined') {
                    msg = this.msg;
                }
                msg = this.options.messageBuilder(msg, args);
                return this.error(msg);
            }
            return this;
        };
    })(key);
}

//Create some aliases - may help code readability
Validator.prototype.validate = Validator.prototype.check;
Validator.prototype.assert = Validator.prototype.check;
Validator.prototype.isDecimal = Validator.prototype.isFloat;
Validator.prototype.is = Validator.prototype.regex;
Validator.prototype.not = Validator.prototype.notRegex;

exports.Validator = Validator;
exports.ValidatorError = ValidatorError;
