var assert = require('assert');
var clearRequire = require('clear-require');
let validator = '';

describe('Startup', function() {
  it('should take <10ms to load', function() {
    clearRequire.all();
    const start = process.hrtime();
    validator = require('../validator');
    const end = process.hrtime(start);
    const time = (end[0] * 1000) + (end[1] / 1000000);
    assert(time < 10);
  });
});
