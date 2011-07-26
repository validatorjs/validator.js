var validatorTests = require('./validator.test.js');
for (test in validatorTests) {
  validatorTests[test]();
}
var filterTests = require('./filter.test.js');
for (test in filterTests) {
  filterTests[test]();
}
