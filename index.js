var node_validator = require('./lib/validator');

exports.Validator = node_validator.Validator;
exports.ValidatorError = node_validator.ValidatorError;
exports.Filter = require('./lib/filter').Filter;
exports.validators = require('./lib/validators');
exports.patterns = require('./lib/patterns');
exports.defaultError = require('./lib/defaultError');
exports.entities = require('./lib/entities');

exports.sanitize = exports.convert = function (str) {
    var filter = new exports.Filter();
    return filter.sanitize(str);
};

exports.check = exports.validate = exports.assert = function  (str, fail_msg) {
    var validator = new exports.Validator();
    return validator.check(str, fail_msg);
};

exports.version = '2.1.0';
