exports.Validator = require('./validator').Validator;

//Quick access methods
exports.check = exports.validate = exports.assert = function(str, fail_msg) {
    var validator = new exports.Validator();
    return validator.check(str, fail_msg);
}
