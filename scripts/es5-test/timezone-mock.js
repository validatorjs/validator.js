/*
 * Stand-in for the `timezone-mock` devDependency in the ES5 test suite.
 *
 * timezone-mock's register() needs Array.prototype.includes (ES2016). Rather
 * than shimming a built-in that the library itself must not rely on, the
 * time-zone emulation is skipped (with a notice) on runtimes without it; the
 * surrounding assertions still run in the process' own time zone.
 */

'use strict';

if (typeof Array.prototype.includes === 'function') {
  // Copied next to this file by scripts/build-es5-tests.js.
  // eslint-disable-next-line global-require, import/no-unresolved, import/extensions
  module.exports = require('./vendor/timezone-mock');
} else {
  module.exports = {
    register: function (timezone) {
      console.log('  note: timezone-mock needs Array.prototype.includes; not emulating ' + timezone);
    },
    unregister: function () {},
  };
}
