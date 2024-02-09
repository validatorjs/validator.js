/**
 * All tests that tests any utility.
 * Prevent any breaking of functionality
 */
import assert from 'assert';
import typeOf from '../src/lib/util/typeOf';
import assertString from '../src/lib/util/assertString';


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
});

describe('assertString', () => {
  it('Should throw an error if no argument is provided', () => {
    assert.throws(() => { assertString(); }, TypeError);
  });

  it('Should throw an error if the argument is not a string, number', () => {
    assert.throws(() => { assertString(123); }, TypeError);
  });

  it('Should throw an error if the argument is not a string, Object', () => {
    assert.throws(() => { assertString({}); }, TypeError);
  });

  it('Should throw an error if the argument is not a string, Array', () => {
    assert.throws(() => { assertString([]); }, TypeError);
  });

  it('Should not throw an error if the argument is a string', () => {
    assert.doesNotThrow(() => { assertString('testing'); });
  });
});
