var validators = require('./validators');
exports.defaultError = require('./defaultError');

var Validator = exports.Validator = function() {}

Validator.prototype.error = function (msg) {
    throw new Error(msg);
};

Validator.prototype.check = function(str, fail_msg) {
    this.str = (str == null || (isNaN(str) && str.length == undefined)) ? '' : str;
    if (typeof this.str == 'number') {
        this.str += '';
    }
    this.msg = fail_msg;
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
                    return this.error(this.msg || exports.defaultError[key]);
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
