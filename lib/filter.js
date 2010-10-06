var Filter = exports.Filter = function() {}

exports.sanitize = function(str) {
    var f = new Filter();
    return f.sanitize(str);
}

Filter.prototype.modify = function(str) {
    this.str = str;
}

Filter.prototype.sanitize = function(str) {
    this.str = str;
    return this;
}

Filter.prototype.ifNull = function(replace) {
    if (!this.str || this.str === '') {
        this.modify(replace);
    }
    return this.str;
}

//Any string with length > 0 (except for '0' and 'false') are considered true,
//all other strings are false
Filter.prototype.toBoolean = function() {
    if (!this.str || this.str == '0' || this.str == 'false' || this.str == '') {
        this.modify(false);
    } else {
        this.modify(true);
    }
    return this.str;
}

//String must be equal to '1' or 'true' to be considered true, all other strings
//are false
Filter.prototype.toBooleanStrict = function() {
    if (this.str == '1' || this.str == 'true') {
        this.modify(true);
    } else {
        this.modify(false);
    }
    return this.str;
}
