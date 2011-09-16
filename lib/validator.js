var net = require('net');

var Validator = exports.Validator = function() {}

Validator.prototype._regexs = {
	email: /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/,
	url: /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/,
	ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
	alpha: /^[a-zA-Z]+$/,
	alphanumeric: /^[a-zA-Z0-9]+$/,
	numeric: /^-?[0-9]+$/,
	lowercase: /^[a-z0-9]+$/,
	uppercase: /^[A-Z0-9]+$/,
	notEmpty: /^[\s\t\r\n]*$/,
	UUIDv3: /[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
	UUIDv4: /[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
	UUID: /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};

Validator.prototype.check = function(str, fail_msg) {
	this.str = (str == null || (isNaN(str) && str.length == undefined)) ? '' : str;
	// Convert numbers to strings but keep arrays/objects
	if (typeof this.str == 'number') {
	  this.str += '';
	}
	this.msg = fail_msg;
	this._errors = [];
	return this;
}

//Create some aliases - may help code readability
Validator.prototype.validate = Validator.prototype.assert = Validator.prototype.check;

Validator.prototype.setMessage = function(msg) {
	this.msg = msg;
	return this;
};

Validator.prototype.error = function(msg) {
	throw new Error(msg);
	return this;
}

Validator.prototype.isEmail = function() {
	if (!this.str.match(this._regexs.email)) {
	   return this.error(this.msg || 'Invalid email');
	}
	return this;
}

Validator.prototype.isUrl = function() {
	if (!this.str.match(this._regexs.url)) {
	   return this.error(this.msg || 'Invalid URL');
	}
	return this;
}

Validator.prototype.isIP = (function() {
	var regex = Validator.prototype._regexs.ip;
	var isIp = net.isIP || function(str) { return str.match(_regex) ? true : 0 };
	return function() {
		//net.isIP is in node >= 0.3.0
		if (isIp(this.str) === 0) {
			return this.error(this.msg || 'Invalid IP');
		}
		return this;
	};
})();

Validator.prototype.isAlpha = function() {
	if (!this.str.match(this._regexs.alpha)) {
	   return this.error(this.msg || 'Invalid characters');
	}
	return this;
}

Validator.prototype.isAlphanumeric = function() {
	if (!this.str.match(this._regexs.alphanumeric)) {
	   return this.error(this.msg || 'Invalid characters');
	}
	return this;
}

Validator.prototype.isNumeric = function() {
	if (!this.str.match(this._regexs.numeric)) {
	   return this.error(this.msg || 'Invalid number');
	}
	return this;
}

Validator.prototype.isLowercase = function() {
	if (!this.str.match(this._regexs.lowercase)) {
	   return this.error(this.msg || 'Invalid characters');
	}
	return this;
}

Validator.prototype.isUppercase = function() {
	if (!this.str.match(this._regexs.uppercase)) {
	   return this.error(this.msg || 'Invalid characters');
	}
	return this;
}

Validator.prototype.isInt = function() {
	// much faster than using a regex
	if (this.str % 1 !== 0) {
	   return this.error(this.msg || 'Invalid integer');
	}
	return this;
}

Validator.prototype.isDecimal = Validator.prototype.isFloat = function() {
	// much faster than using a regex
	if (this.str % 1 === NaN) {
	   return this.error(this.msg || 'Invalid decimal');
	}
	return this;
}

Validator.prototype.notNull = function() {
	if (this.str === '') {
	   return this.error(this.msg || 'Invalid characters');
	}
	return this;
}

Validator.prototype.isNull = function() {
	if (this.str !== '') {
	   return this.error(this.msg || 'Invalid characters');
	}
	return this;
}

Validator.prototype.notEmpty = function() {
	if (this.str.match(this._regexs.notEmpty)) {
	   return this.error(this.msg || 'String is empty');
	}
	return this;
}

Validator.prototype.equals = function(equals) {
	if (this.str != equals) {
	   return this.error(this.msg || 'Not equal');
	}
	return this;
}

Validator.prototype.contains = function(str) {
	if (this.str.indexOf(str) === -1) {
	   return this.error(this.msg || 'Invalid characters');
	}
	return this;
}

Validator.prototype.notContains = function(str) {
	if (this.str.indexOf(str) >= 0) {
	   return this.error(this.msg || 'Invalid characters');
	}
	return this;
}

Validator.prototype.regex = Validator.prototype.is = function(pattern, modifiers) {
	if (typeof pattern !== 'function') {
		pattern = new RegExp(pattern, modifiers);
	}
	if (! this.str.match(pattern)) {
	   return this.error(this.msg || 'Invalid characters');
	}
	return this;
}

Validator.prototype.notRegex = Validator.prototype.not = function(pattern, modifiers) {
	if (typeof pattern !== 'function') {
		pattern = new RegExp(pattern, modifiers);
	}
	if (this.str.match(pattern)) {
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
	var pattern = this._regexs.UUID;
	if (version == 3 || version == 'v3') {
		pattern = this._regexs.UUIDv3;
	} else if (version == 4 || version == 'v4') {
		pattern = this._regexs.UUIDv4;
	}
	if (!this.str.match(pattern)) {
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
	var origTime = new Date(this.str).getTime();
	var compTime = (date ? new Date(date) : new Date()).getTime()

	if (isNaN(origTime + compTime) || origTime < compTime) {
		return this.error(this.msg || 'Invalid date');
	}

	return this;
}

Validator.prototype.isBefore = function(date) {
	var origTime = new Date(this.str).getTime();
	var compTime = (date ? new Date(date) : new Date()).getTime();

	if (isNaN(origTime + compTime) || origTime > compTime) {
		return this.error(this.msg || 'Invalid date');
	}

	return this;
}

Validator.prototype.in = function(options) {
	if (options && typeof options.indexOf === 'function') {
		if (!~options.indexOf(this.str)) {
			return this.error(this.msg || 'Unexpected value');
		}
	} else {
		return this.error(this.msg || 'Invalid in() argument');
	}
	return this;
}

Validator.prototype.notIn = function(options) {
	if (options && typeof options.indexOf === 'function') {
		if (options.indexOf(this.str) !== -1) {
			return this.error(this.msg || 'Unexpected value');
		}
	} else {
		return this.error(this.msg || 'Invalid notIn() argument');
	}
	return this;
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

