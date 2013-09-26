[
  { name: 'validator', file: './validator.test.js' },
  { name: 'filter', file: './filter.test.js' },
  { name: 'messages', file: './messages.test.js' },
  { name: 'index exports', file: './index.test.js' }
].forEach(function(suite) {
  var tests = require(suite.file),
      test;
  for (test in tests) {
    console.log('Initializing ' + suite.name + ' test:', test);
    tests[test]();
  }
});
