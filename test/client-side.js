import assert from 'assert';
import validator from '../validator';
import min from '../validator.min';

describe('Minified version', () => {
  it('should export the same things as the server-side version', () => {
    for (let key in validator) {
      if ({}.hasOwnProperty.call(validator, key)) {
        assert.equal(
          typeof validator[key],
          typeof min[key], `Minified version did not export ${key}`
        );
      }
    }
  });

  it('should be up to date', () => {
    assert.equal(min.version, validator.version, 'Minified version mismatch. Run `make min`');
  });

  it('should validate strings', () => {
    assert.equal(min.isEmail('foo@bar.com'), true);
    assert.equal(min.isEmail('foo'), false);
  });

  it('should sanitize strings', () => {
    assert.equal(min.toBoolean('1'), true);
  });
});
