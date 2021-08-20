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
  it('should validate strings', () => {
    assert.strictEqual(validator.isAadharCardNumber('820315678934'), true);
    assert.strictEqual(validator.isAadharCardNumber('63789'), false);
  });
  it('should validate strings', () => {
    assert.strictEqual(validator.isCountryByCode('IN'), 'India');
    assert.strictEqual(validator.isCountryByCode('HU'), 'Hungary');
    assert.strictEqual(validator.isCountryByCode('XU'), 'Invalid Countrycode');
  });
  it('should validate strings', () => {
    assert.strictEqual(validator.isValidCountryName('India'), true);
    assert.strictEqual(validator.isValidCountryName('india'), true);
    assert.strictEqual(validator.isValidCountryName('str'), false);
  });
  it('should sanitize strings', () => {
    assert.strictEqual(min.toBoolean('1'), true);
  });
});
