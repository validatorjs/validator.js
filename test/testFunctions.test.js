import assert from 'assert';
import test from './testFunctions';

describe('test helper', () => {
  it('should require either a validator or sanitizer option', () => {
    assert.throws(
      () => test({}),
      /test\(\) requires either "validator" or "sanitizer" option/
    );
  });

  it('should reject an invalid validator name', () => {
    assert.throws(
      () => test({ validator: 'notARealMethod' }),
      /test\(\) received invalid validator\/sanitizer "notARealMethod"; expected a function name exported by validator/
    );
  });

  it('should reject an invalid sanitizer name', () => {
    assert.throws(
      () => test({ sanitizer: 'notARealMethod' }),
      /test\(\) received invalid validator\/sanitizer "notARealMethod"; expected a function name exported by validator/
    );
  });

  it('should prefer validator over sanitizer when both are provided', () => {
    assert.doesNotThrow(() => test({
      validator: 'equals',
      sanitizer: 'trim',
      args: ['foo'],
      valid: ['foo'],
      invalid: [' bar '],
    }));
  });

  it('should pass valid validator cases through', () => {
    assert.doesNotThrow(() => test({
      validator: 'isEmail',
      valid: ['foo@bar.com'],
    }));
  });

  it('should pass invalid validator cases through', () => {
    assert.doesNotThrow(() => test({
      validator: 'isEmail',
      invalid: ['not-an-email'],
    }));
  });

  it('should pass sanitizer expectation checks through', () => {
    assert.doesNotThrow(() => test({
      sanitizer: 'trim',
      expect: {
        '  foo  ': 'foo',
        bar: 'bar',
      },
    }));
  });

  it('should use an explicitly provided args array', () => {
    assert.doesNotThrow(() => test({
      validator: 'equals',
      args: ['foo'],
      valid: ['foo'],
      invalid: ['bar'],
    }));
  });

  it('should treat NaN expectations as equal', () => {
    assert.doesNotThrow(() => test({
      sanitizer: 'toFloat',
      expect: {
        foo: NaN,
      },
    }));
  });

  it('should pass error cases through when the validator throws', () => {
    assert.doesNotThrow(() => test({
      validator: 'isEmail',
      error: [null],
    }));
  });

  it('should throw a helpful error when an expectation fails', () => {
    assert.throws(
      () => test({
        sanitizer: 'trim',
        expect: {
          '  foo  ': 'bar',
        },
      }),
      /validator\.trim\(" {2}foo {2}"\) returned "foo" but should have returned "bar"/
    );
  });

  it('should throw a helpful error when a valid case fails', () => {
    assert.throws(
      () => test({
        validator: 'isEmail',
        valid: ['not-an-email'],
      }),
      /validator\.isEmail\("not-an-email"\) failed but should have passed/
    );
  });

  it('should throw a helpful error when an invalid case passes', () => {
    assert.throws(
      () => test({
        validator: 'isEmail',
        invalid: ['foo@bar.com'],
      }),
      /validator\.isEmail\("foo@bar.com"\) passed but should have failed/
    );
  });

  it('should throw a helpful error when an error case does not throw', () => {
    assert.throws(
      () => test({
        validator: 'isEmail',
        error: ['foo@bar.com'],
      }),
      /validator\.isEmail\("foo@bar.com"\) passed but should error/
    );
  });
});
