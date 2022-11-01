import assert from 'assert';
import validator from '../validator';
import min from '../validator.min';

describe('Minified version', () => {
  it('should export the same things as the server-side version', () => {
    for (let key in validator) {
      if ({}.hasOwnProperty.call(validator, key)) {
        assert.strictEqual(
          typeof validator[key],
          typeof min[key], `Minified version did not export ${key}`
        );
      }
    }
  });

  it('should be up to date', () => {
    assert.strictEqual(min.version, validator.version, 'Minified version mismatch. Run `make min`');
  });

  it('should validate strings', () => {
    assert.strictEqual(min.isEmail('foo@bar.com'), true);
    assert.strictEqual(min.isEmail('foo'), false);
  });

  it('should convert string into kebab case', () => {
    assert.strictEqual(min.strTokebab('validator js is a best library'), 'validator-js-is-a-best-library');
  });

  it('should convert http query params to object data', () => {
    assert.deepStrictEqual(min.queryStrToObject('https://www.example.com/watch?v=oehcVTHRwLE'), { v: 'oehcVTHRwLE' });
    assert.deepStrictEqual(min.queryStrToObject('?name=validatorjs&popular=yes'), { name: 'validatorjs', popular: 'yes' });
    assert.deepStrictEqual(min.queryStrToObject('name=validatorjs&popular=yes'), { name: 'validatorjs', popular: 'yes' });
  });

  it('should sanitize strings', () => {
    assert.strictEqual(min.toBoolean('1'), true);
  });
});
