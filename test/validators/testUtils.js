import assert from 'assert';
import { format } from 'util';
import validator from '../../src/index';

function repeat(str, count) {
  let result = '';
  for (; count; count--) {
    result += str;
  }
  return result;
}

function test(options) {
  let args = options.args || [];
  args.unshift(null);
  if (options.error) {
    options.error.forEach((error) => {
      args[0] = error;
      try {
        assert.throws(() => validator[options.validator](...args));
      } catch (err) {
        let warning = format(
          'validator.%s(%s) passed but should error',
          options.validator, args.join(', ')
        );
        throw new Error(warning);
      }
    });
  }
  if (options.valid) {
    options.valid.forEach((valid) => {
      args[0] = valid;
      if (validator[options.validator](...args) !== true) {
        let warning = format(
          'validator.%s(%s) failed but should have passed',
          options.validator, args.join(', ')
        );
        throw new Error(warning);
      }
    });
  }
  if (options.invalid) {
    options.invalid.forEach((invalid) => {
      args[0] = invalid;
      if (validator[options.validator](...args) !== false) {
        let warning = format(
          'validator.%s(%s) passed but should have failed',
          options.validator, args.join(', ')
        );
        throw new Error(warning);
      }
    });
  }
}

export default {
  repeat,
  test,
};
