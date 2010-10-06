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

Filter.prototype.toBoolean = function() {
    if (this.str == '1' || this.str == 'true' || this.str == 'yes') {
        this.modify(true);
    } else {
        this.modify(false);
    }
    return this.str;
}
