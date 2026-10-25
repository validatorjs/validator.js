/**
 * All tests that tests any utility.
 * Prevent any breaking of functionality
 */
import assert from 'assert';
import typeOf from '../src/lib/util/typeOf';
import assertString from '../src/lib/util/assertString';
import startsWith from '../src/lib/util/startsWith';
import endsWith from '../src/lib/util/endsWith';
import lookupSet from '../src/lib/util/lookupSet';
import validator from '../src/index';


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

  it('Should not throw an error if the argument is a String object', () => {
    assert.doesNotThrow(() => { assertString(new String('abc')); }); // eslint-disable-line no-new-wrappers
  });

  it('Should name the received type in the error message', () => {
    assert.throws(() => { assertString(2024); }, /^TypeError: Expected a string but received a Number$/);
    assert.throws(() => { assertString(null); }, /^TypeError: Expected a string but received a null$/);
    assert.throws(() => { assertString(Object.create(null)); }, TypeError);
  });

  it('Should throw an error for an object with an anonymous constructor', () => {
    // Returned from a function so that nothing gives the constructor a name.
    const makeConstructor = () => function () {};
    const Anonymous = makeConstructor();
    assert.strictEqual(Anonymous.name, '');
    assert.throws(() => { assertString(new Anonymous()); }, /^TypeError: Expected a string but received a $/);
  });

  // IE 11 has no Function#name, so constructor names come from their source.
  it('Should work on engines without Function#name', function () {
    const owners = [Function.prototype, String, Number];
    const descriptors = owners.map(owner => Object.getOwnPropertyDescriptor(owner, 'name'));
    if (descriptors.some(descriptor => !descriptor || !descriptor.configurable)) {
      this.skip(); // Function#name cannot be removed on this engine
      return;
    }
    try {
      owners.forEach((owner) => { delete owner.name; });
      assert.strictEqual(String.name, undefined);
      assert.doesNotThrow(() => { assertString('abc'); });
      assert.throws(() => { assertString(2024); }, /^TypeError: Expected a string but received a Number$/);
      assert.strictEqual(validator.isEmail('foo@bar.com'), true);
      assert.strictEqual(validator.isInt('12'), true);
      assert.throws(() => { validator.isEmail(12); }, /received a Number/);
    } finally {
      owners.forEach((owner, i) => { Object.defineProperty(owner, 'name', descriptors[i]); });
    }
  });
});

describe('ES5 replacements for ES2015 built-ins', () => {
  it('startsWith should match String.prototype.startsWith', () => {
    assert.strictEqual(startsWith('abc', ''), true);
    assert.strictEqual(startsWith('abc', 'a'), true);
    assert.strictEqual(startsWith('abc', 'abc'), true);
    assert.strictEqual(startsWith('abc', 'abcd'), false);
    assert.strictEqual(startsWith('abc', 'b'), false);
    assert.strictEqual(startsWith('', 'a'), false);
    assert.strictEqual(startsWith('undefined!', undefined), true);
  });

  it('endsWith should match String.prototype.endsWith', () => {
    assert.strictEqual(endsWith('abc', ''), true);
    assert.strictEqual(endsWith('abc', 'c'), true);
    assert.strictEqual(endsWith('abc', 'abc'), true);
    assert.strictEqual(endsWith('abc', 'zabc'), false);
    assert.strictEqual(endsWith('abc', 'b'), false);
    assert.strictEqual(endsWith('', 'a'), false);
    assert.strictEqual(endsWith('is null', null), true);
  });

  function checkLookupSet(set) {
    assert.strictEqual(set.has('AD'), true);
    assert.strictEqual(set.has('004'), true);
    assert.strictEqual(set.has('ad'), false);
    assert.strictEqual(set.has(4), false);
    assert.strictEqual(set.has(''), false);
    assert.strictEqual(set.has(undefined), false);
    assert.strictEqual(set.has('toString'), false);
    assert.strictEqual(set.has('hasOwnProperty'), false);
    assert.strictEqual(set.has('__proto__'), false);
  }

  it('lookupSet should return a native Set where available', function () {
    if (typeof Set !== 'function') {
      this.skip();
      return;
    }
    const set = lookupSet(['AD', '004']);
    assert.ok(set instanceof Set);
    assert.strictEqual(set.size, 2);
    checkLookupSet(set);
  });

  it('lookupSet should work without a global Set', () => {
    const NativeSet = global.Set;
    let set;
    global.Set = undefined;
    try {
      set = lookupSet(['AD', '004']);
    } finally {
      global.Set = NativeSet;
    }
    assert.strictEqual(typeof set.has, 'function');
    checkLookupSet(set);
  });
});
