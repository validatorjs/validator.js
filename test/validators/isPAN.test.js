import validator from '../../src/index';
import assert from 'assert';

describe('isPAN', () => {
  it('valid PAN', () => {
    assert.strictEqual(validator.isPAN('ABCDE1234F'), true);
  });

  it('invalid length', () => {
    assert.strictEqual(validator.isPAN('ABCDE123F'), false);
  });

  it('lowercase should fail', () => {
    assert.strictEqual(validator.isPAN('abcde1234f'), false);
  });

  it('wrong format', () => {
    assert.strictEqual(validator.isPAN('1234ABCDE1'), false);
  });

  it('empty string', () => {
    assert.strictEqual(validator.isPAN(''), false);
  });
});
