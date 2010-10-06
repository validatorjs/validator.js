Filter = function() {};
exports.Filter = new Filter();

Filter.prototype.modify = function(str) {
    //Override
}

Filter.prototype.filter = function(str) {
    this.str = str;
    return this;
}

Filter.prototype.ifNull = function(replace) {
    if (!this.str || this.str === '') {
        this.modify(replace);
    }
    return this.str;
}
