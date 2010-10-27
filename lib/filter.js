var entities = require('./entities');
    xss = require('./xss');

var Filter = exports.Filter = function() {}

Filter.prototype.modify = function(str) {
    this.str = str;
}

Filter.prototype.sanitize = function(str) {
    this.str = str;
    return this;
}

//Create some aliases - may help code readability
Filter.prototype.convert = Filter.prototype.sanitize;

Filter.prototype.xss = function(is_image) {
    this.str = xss.clean(this.str, is_image);
    this.modify(this.str);
    return this.str;
}

Filter.prototype.entityDecode = function() {
    this.str = entities.decode(this.str);
    this.modify(this.str);
    return this.str;
}

Filter.prototype.entityEncode = function() {
    this.str = entities.encode(this.str);
    this.modify(this.str);
    return this.str;
}

Filter.prototype.ltrim = function() {
    this.str = this.str.replace(/^(?:\s|\t|\r|\n)+/g, '');
    this.modify(this.str);
    return this.str;
}

Filter.prototype.rtrim = function() {
    this.str = this.str.replace(/(?:\s|\t|\r|\n)+$/g, '');
    this.modify(this.str);
    return this.str;
}

Filter.prototype.trim = function() {
    this.modify(this.str.replace(/^(?:\s|\t|\r|\n)+|(?:\s|\t|\r|\n)+$/g, ''));
    return this.str;
}

Filter.prototype.ifNull = function(replace) {
    if (!this.str || this.str === '') {
        this.modify(replace);
    }
    return this.str;
}

Filter.prototype.toFloat = function() {
    this.modify(parseFloat(this.str));
    return this.str;
}

Filter.prototype.toInt = function() {
    this.modify(parseInt(this.str));
    return this.str;
}

//Any strings with length > 0 (except for '0' and 'false') are considered true,
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
