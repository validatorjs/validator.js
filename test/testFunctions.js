import assert from 'assert';
import { format } from 'util';
import validator from '../src/index';

function stringifyArgs(argsArr) {
  return argsArr.map(arg => JSON.stringify(arg)).join(', ');
}

export default function test(options) {
  const args = options.args || [];
  const method = options.validator || options.sanitizer;

  if (!method) {
    throw new Error('test() requires either "validator" or "sanitizer" option');
  }

  if (typeof validator[method] !== 'function') {
    throw new Error(format(
      'test() received invalid validator/sanitizer "%s"; expected a function name exported by validator',
      method
    ));
  }
  args.unshift(null);

  if (options.expect) {
    Object.keys(options.expect).forEach((input) => {
      args[0] = input;
      let result = validator[method](...args);
      let expected = options.expect[input];

      if (isNaN(result) && !result.length && isNaN(expected)) {
        return;
      }

      if (result !== expected) {
        const warning = format(
          'validator.%s(%s) returned "%s" but should have returned "%s"',
          method, stringifyArgs(args), result, expected
        );

        throw new Error(warning);
      }
    });
  }

  if (options.error) {
    options.error.forEach((error) => {
      args[0] = error;

      try {
        assert.throws(() => validator[method](...args));
      } catch (err) {
        const warning = format(
          'validator.%s(%s) passed but should error',
          method, stringifyArgs(args)
        );

        throw new Error(warning);
      }
    });
  }

  if (options.valid) {
    options.valid.forEach((valid) => {
      args[0] = valid;

      if (validator[method](...args) !== true) {
        const warning = format(
          'validator.%s(%s) failed but should have passed',
          method, stringifyArgs(args)
        );

        throw new Error(warning);
      }
    });
  }

  if (options.invalid) {
    options.invalid.forEach((invalid) => {
      args[0] = invalid;

      if (validator[method](...args) !== false) {
        const warning = format(
          'validator.%s(%s) passed but should have failed',
          method, stringifyArgs(args)
        );

        throw new Error(warning);
      }
    });
  }
}
