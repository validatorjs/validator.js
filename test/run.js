var validatorTests = require('./validator.test.js');
for (test in validatorTests) {
	console.log('Initializing validator test:', test);
  validatorTests[test]();
}
var filterTests = require('./filter.test.js');
for (test in filterTests) {
	console.log('Initializing filter test:', test);
  filterTests[test]();
}
