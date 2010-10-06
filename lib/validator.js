Validator = function() {}
exports.Validator = new Validator();

Validator.prototype.check = function(str, fail_msg) {
    this.str = String(str);
    this.msg = fail_msg;
    return this;
}

Validator.prototype.error = function(msg) {
    throw msg;
    return this;
}

Validator.prototype.isEmail = function() {
    if (!this.str || !this.str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)) {
        this.error(this.msg || 'Invalid email');
    }
    return this;
}

Validator.prototype.isUrl = function() {
    if (!this.str || !this.str.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2})?)|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |/.,*:;=]|%[a-f\d]{2})*)?$/)) {
        this.error(this.msg || 'Invalid URL');
    }
    return this;
}

Validator.prototype.isAlpha = function() {
    if (!this.str || !this.str.match(/^[a-zA-Z]+$/)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isAlphanumeric = function() {
    if (!this.str || !this.str.match(/^[a-zA-Z0-9]+$/)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isNumeric = function() {
    if (!this.str || !this.str.match(/^[0-9]+$/)) {
        this.error(this.msg || 'Invalid number');
    }
    return this;
}

Validator.prototype.isLowercase = function() {
    if (!this.str || !this.str.match(/^[a-z0-9]+$/)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isUppercase = function() {
    if (!this.str || !this.str.match(/^[A-Z0-9]+$/)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isInt = function() {
    if (!this.str || !this.str.match(/^(?:0|[1-9][0-9]*)$/)) {
        this.error(this.msg || 'Invalid integer');
    }
    return this;
}

Validator.prototype.isDecimal = function() {
    if (!this.str || !this.str.match(/^(?:0|[1-9][0-9]*)(?:\.[0-9]*)?$/)) {
        this.error(this.msg || 'Invalid decimal');
    }
    return this;
}

Validator.prototype.notNull = function() {
    if (!this.str || !this.str !== '') {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isNull = function() {
    if (this.str !== '' && this.str) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.equals = function(equals) {
    if (this.str != equals) {
        this.error(this.msg || 'Not equal');
    }
    return this;
}

Validator.prototype.regex = function(pattern, modifiers) {
    if (typeof pattern !== 'function') {
        pattern = new RegExp(pattern, modifiers || '');
    }
    if (! (this.str || '').match(pattern)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.notRegex = function(pattern, modifiers) {
    if (typeof pattern !== 'function') {
        pattern = new RegExp(pattern, modifiers || '');
    }
    if ((this.str || '').match(pattern)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}
