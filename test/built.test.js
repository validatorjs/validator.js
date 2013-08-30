// tests exports of built validator.js file

var node_validator = require('../validator.js');

module.exports = require('./exports.test.js')(node_validator);