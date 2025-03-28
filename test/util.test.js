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
  it('Should throw an error if argument provided is an undefined', () => {
    assert.throws(() => { assertString(); }, TypeError);
  });

  it('Should throw an error if argument provided is a null', () => {
    assert.throws(() => { assertString(null); }, TypeError);
  });

  it('Should throw an error if argument provided is a Boolean', () => {
    assert.throws(() => { assertString(true); }, TypeError);
  });

  it('Should throw an error if argument provided is a Date', () => {
    assert.throws(() => { assertString(new Date()); }, TypeError);
  });

  it('Should throw an error if argument provided is a Number(NaN)', () => {
    assert.throws(() => { assertString(NaN); }, TypeError);
  });

  it('Should throw an error if argument provided is a Number', () => {
    assert.throws(() => { assertString(2024); }, TypeError);
  });

  it('Should throw an error if argument provided is an Object', () => {
    assert.throws(() => { assertString({}); }, TypeError);
  });

  it('Should throw an error if argument provided is an Array', () => {
    assert.throws(() => { assertString([]); }, TypeError);
  });

  it('Should not throw an error if the argument is an empty string', () => {
    assert.doesNotThrow(() => { assertString(''); });
  });

  it('Should not throw an error if the argument is a String', () => {
    assert.doesNotThrow(() => { assertString('antidisestablishmentarianism'); });
  });
});
