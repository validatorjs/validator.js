/**
 * All tests that tests any utility.
 * Prevent any breaking of functionality
 */
import assert from 'assert';
import typeOf from '../src/lib/util/typeOf';
import validateKey from '../src/lib/util/validateKey';

describe('Util', () => {
  it('should validate different typeOf', () => {
    assert.strictEqual(typeOf([]), 'array');
    assert.strictEqual(typeOf(null), 'null');
    assert.strictEqual(typeOf({}), 'object');
    assert.strictEqual(typeOf(new Date()), 'date');
    assert.strictEqual(typeOf('ezkemboi'), 'string');
    assert.strictEqual(typeOf(String('kemboi')), 'string');
    assert.strictEqual(typeOf(undefined), 'undefined');
    assert.strictEqual(typeOf(2021), 'number');
    assert.notStrictEqual(typeOf([]), 'object');
  });
  it('should validate key in object', () => {
    assert.strictEqual(validateKey(
      {
        a: 1,
        b: 2,
      },
      'a',
      'Unknown key found'
    ), true);
    assert.strictEqual(validateKey(
      {
        a: 1,
        b: 2,
      },
      'b',
      'Unknown key found'
    ), true);
    assert.strictEqual(validateKey(
      {
        1: 'a',
        b: 2,
      },
      1,
      'Unknown key found'
    ), true);

    assert.throws(() => validateKey(
      {
        a: 1,
        b: 2,
      },
      'c',
      'Unknown key found'
    ), /Unknown key found/);

    assert.strictEqual(validateKey(
      {
        a: undefined,
        b: 2,
      },
      'a',
      'Unknown key found'
    ), true);
  });
});
