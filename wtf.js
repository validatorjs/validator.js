var util = require('util');

function ValidatorError (msg) {
    Error.captureStackTrace(this, this);
    this.name = ValidatorError;
    this.message = msg;
    // this.name = 'ValidatorError';
};
// ValidatorError.prototype = new Error();
util.inherits(ValidatorError, Error);

try {
	throw new ValidatorError('wtf?');
} catch(e) {
	console.log(e instanceof ValidatorError);
}