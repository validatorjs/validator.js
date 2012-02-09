exports.Validator = require('./validator').Validator;
exports.Filter = require('./filter').Filter;
exports.validators = require('./validators');

exports.entities = require('./entities');

//Quick access methods
exports.sanitize = exports.convert = function(str) {
    var filter = new exports.Filter();
    return filter.sanitize(str);
}

exports.check = exports.validate = exports.assert = function(str, fail_msg) {
    var validator = new exports.Validator();
    return validator.check(str, fail_msg);
}
