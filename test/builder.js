import assert from 'assert';
import * as validator from '../validator';

function test(value, operation, assertions) {
  const instance = new validator.Validator(value);
  const result = operation(instance);
  assertions(result);
}

describe('Validator Builder', () => {
  it('should return an object', () => {
    const instance = new validator.Validator('50');
    const result = instance.isBoolean().validate();
    assert.equal(typeof result, 'object');
    assert.deepEqual(result, { valid: false, errors: [{ value: 'value is not a Boolean' }] });
  });
  it('should valid email address', () => {
    test('sk@gmail.com', instance => instance.isEmail().validate(), (result) => {
      assert.deepEqual(result, { valid: true, errors: [] });
      assert.deepEqual(result, { valid: true, errors: [] });
    });
  });
  it('should valid email address as email and contains @', () => {
    test('sk@gmail.com', instance => instance.isEmail().contains('@').validate(), (result) => {
      assert.deepEqual(result, { valid: true, errors: [] });
    });
  });
  it('should valid as a IP and not MAC Address', () => {
    test('192.168.1.0', instance => instance.isIP().isMACAddress('@').validate(), (result) => {
      assert.deepEqual(result.valid, false);
      assert.deepEqual(result.errors.length, 1);
      assert.deepEqual(result.errors, [{ value: 'value is not a MAC Address' }]);
    });
  });
  it('should return instance of Validator', () => {
    test('127.56.1.8', instance => instance.isIP(), (result) => {
      assert.equal(result instanceof validator.Validator, true);
      assert.equal(result.value, '127.56.1.8');
    });
  });
  it('should return multiple error messages', () => {
    test('hello', instance => instance.isURL().isEmail().validate(), (result) => {
      assert.equal(result.valid, false);
      assert.equal(result.errors.length, 2);
      assert.deepEqual(result.errors, [{ value: 'value is not an URL' }, { value: 'value is not an Email' }]);
    });
  });
  it('should return value with type integer', () => {
    test('456', instance => instance.toInt(), (result) => {
      assert.equal(typeof result.value, 'number');
    });
  });
});
