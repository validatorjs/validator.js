// The ES5 test runner runs as-is on Node.js 0.10 (and is meant to be reusable
// in other hosts), so it is parsed as ES5 and ES2015 style rules are off.
module.exports = {
  parser: 'espree',
  parserOptions: {
    ecmaVersion: 5,
    sourceType: 'script',
  },
  env: {
    es6: false,
  },
  rules: {
    'no-var': 'off',
    'object-shorthand': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-rest-params': 'off',
    'prefer-spread': 'off',
    'prefer-template': 'off',
    'vars-on-top': 'off',
  },
};
