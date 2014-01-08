var utils = exports;

utils.coerce = function (input) {
    if (input === null || typeof input === 'undefined' || (isNaN(input) && !input.length)) {
        input = '';
    } else if (typeof input === 'object' && input !== null && input.toString) {
        input = input.toString();
    }
    return input + '';
};

utils.toDate = function (date) {
    if (date instanceof Date) {
        return date;
    }
    var intDate = Date.parse(date);
    if (isNaN(intDate)) {
        return null;
    }
    return new Date(intDate);
};
