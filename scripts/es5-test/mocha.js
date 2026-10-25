/*
 * Stand-in for `import { describe, it } from 'mocha'` in the ES5 test suite:
 * forwards to the describe/it globals installed by the runner.
 */

'use strict';

module.exports = {
  describe: function () {
    return global.describe.apply(this, arguments);
  },
  it: function () {
    return global.it.apply(this, arguments);
  },
};
