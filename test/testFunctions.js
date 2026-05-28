import assert from 'assert';
import { format } from 'util';
import validator from '../src/index';

function stringifyArgs(argsArr) {
  return argsArr.map(arg => JSON.stringify(arg)).join(', ');
}

export default function test(options) {
  const args = options.args || [];

  args.unshift(null);

  if (options.error) {
    options.error.forEach((error) => {
      args[0] = error;

      try {
        assert.throws(() => validator[options.validator](...args));
      } catch (err) {
        const warning = format(
          'validator.%s(%s) passed but should error',
          options.validator, stringifyArgs(args)
        );

        throw new Error(warning);
      }
    });
  }

  if (options.valid) {
    options.valid.forEach((valid) => {
      args[0] = valid;

      if (validator[options.validator](...args) !== true) {
        const warning = format(
          'validator.%s(%s) failed but should have passed',
          options.validator, stringifyArgs(args)
        );

        throw new Error(warning);
      }
    });
  }

  if (options.invalid) {
    options.invalid.forEach((invalid) => {
      args[0] = invalid;

      if (validator[options.validator](...args) !== false) {
        const warning = format(
          'validator.%s(%s) passed but should have failed',
          options.validator, stringifyArgs(args)
        );

        throw new Error(warning);
      }
    });
  }
}
