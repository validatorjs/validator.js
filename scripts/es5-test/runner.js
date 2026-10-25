/*
 * A minimal, dependency-free describe/it test runner written in plain ES5.
 *
 * It runs the Mocha-style test suite (compiled to ES5 by
 * scripts/build-es5-tests.js) on runtimes where Mocha cannot be installed,
 * such as Node.js 0.10. The core uses no Node.js APIs: output goes through an
 * injected `print` function and the result is returned to the caller, so the
 * same runner can be driven from another host (Deno, Bun, a browser page).
 *
 * Supported: nested describe(), it(), this.skip(), this.timeout() (ignored).
 * run({ skip: { '<full title>': '<reason>' } }) lets a host mark tests it
 * cannot support as pending; the reason is printed.
 * Tests must be synchronous; a test that takes a `done` callback or returns a
 * promise is reported as a failure rather than silently passing.
 */

'use strict';

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.createTestRunner = factory();
  }
}(this, function () {
  var SKIP = {};

  function describeError(error) {
    if (error && error.stack) return String(error.stack);
    return String(error);
  }

  function isThenable(value) {
    return value !== null &&
      (typeof value === 'object' || typeof value === 'function') &&
      typeof value.then === 'function';
  }

  return function createTestRunner() {
    var tests = [];
    var suites = [];
    var failures = [];

    function fullTitle(title) {
      return suites.concat([title]).join(' > ');
    }

    function fail(title, error) {
      failures.push({ title: title, error: error });
    }

    function describe(title, fn) {
      suites.push(title);
      try {
        fn.call({ timeout: function () {} });
      } catch (error) {
        // Mocha aborts the whole run here; recording it keeps other files running.
        fail(suites.join(' > ') + ' (describe callback)', error);
      }
      suites.pop();
    }

    function it(title, fn) {
      tests.push({ title: fullTitle(title), fn: fn });
    }

    // Collects the tests of one file; errors thrown while loading it are failures.
    function load(title, fn) {
      try {
        fn();
      } catch (error) {
        fail(title + ' (while loading)', error);
      }
    }

    function run(options) {
      var print = (options && options.print) || function (line) { console.log(line); };
      var grep = options && options.grep;
      var skip = (options && options.skip) || {};
      var skipped = {};
      var passed = 0;
      var pending = 0;
      var i, test, context, result;

      for (i = 0; i < tests.length; i++) {
        test = tests[i];
        if (Object.prototype.hasOwnProperty.call(skip, test.title)) {
          skipped[test.title] = true;
          pending += 1;
          print('  skipped: ' + test.title + ' (' + skip[test.title] + ')');
        } else if (!grep || test.title.indexOf(grep) !== -1) {
          context = {
            skip: function () { throw SKIP; },
            timeout: function () {},
            slow: function () {},
          };
          try {
            if (test.fn.length > 0) {
              throw new Error('asynchronous tests (done callback) are not supported by this runner');
            }
            result = test.fn.call(context);
            if (isThenable(result)) {
              throw new Error('asynchronous tests (returned promise) are not supported by this runner');
            }
            passed += 1;
          } catch (error) {
            if (error === SKIP) {
              pending += 1;
            } else {
              fail(test.title, error);
            }
          }
        }
      }

      Object.keys(skip).forEach(function (title) {
        if (!skipped[title]) print('  warning: no test matches skip entry "' + title + '"');
      });

      for (i = 0; i < failures.length; i++) {
        print('');
        print('  ' + (i + 1) + ') ' + failures[i].title);
        print('     ' + describeError(failures[i].error).split('\n').join('\n     '));
      }
      print('');
      print('  ' + passed + ' passing');
      if (pending) print('  ' + pending + ' pending');
      if (failures.length) print('  ' + failures.length + ' failing');

      return {
        passed: passed,
        pending: pending,
        failed: failures.length,
        failures: failures,
      };
    }

    return {
      describe: describe,
      it: it,
      load: load,
      run: run,
    };
  };
}));
