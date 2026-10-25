/*
 * The subset of Node.js' `assert` API that the test files (and timezone-mock)
 * use, for the browser test bundle built by test/browser/run.mjs.
 *
 * Semantics follow Node.js' strict assertion mode for the cases the tests
 * exercise. Keep this file small: if a test starts using another assert method,
 * the bundle will fail to build ("... is not exported by ...") or the test will
 * throw a TypeError, and the method should be added here.
 */

function inspect(value) {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`;
  try {
    const json = JSON.stringify(value);
    if (json !== undefined) return json;
  } catch (e) {
    // Circular structures and the like: fall back to String().
  }
  return String(value);
}

export class AssertionError extends Error {
  constructor(options) {
    super(options.message);
    this.name = 'AssertionError';
    this.code = 'ERR_ASSERTION';
    this.actual = options.actual;
    this.expected = options.expected;
    this.operator = options.operator;
  }
}

function fail(message, defaultMessage, details) {
  if (message instanceof Error) throw message;
  throw new AssertionError(Object.assign({ message: message || defaultMessage }, details));
}

export default function assert(value, message) {
  if (!value) {
    fail(message, `The expression evaluated to a falsy value: ${inspect(value)}`, {
      actual: value,
      expected: true,
      operator: '==',
    });
  }
}

export function ok(value, message) {
  assert(value, message);
}

export function strictEqual(actual, expected, message) {
  if (!Object.is(actual, expected)) {
    fail(message, `Expected values to be strictly equal: ${inspect(actual)} !== ${inspect(expected)}`, {
      actual, expected, operator: 'strictEqual',
    });
  }
}

export function notStrictEqual(actual, expected, message) {
  if (Object.is(actual, expected)) {
    fail(message, `Expected "actual" to be strictly unequal to: ${inspect(expected)}`, {
      actual, expected, operator: 'notStrictEqual',
    });
  }
}

function isDeepStrictEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  const tag = Object.prototype.toString.call(a);
  if (tag !== Object.prototype.toString.call(b)) return false;
  if (tag === '[object Date]') return Object.is(a.getTime(), b.getTime());
  if (tag === '[object RegExp]') return String(a) === String(b);
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => Object.prototype.hasOwnProperty.call(b, key) &&
    isDeepStrictEqual(a[key], b[key]));
}

export function deepStrictEqual(actual, expected, message) {
  if (!isDeepStrictEqual(actual, expected)) {
    fail(message, `Expected values to be strictly deep-equal: ${inspect(actual)} !== ${inspect(expected)}`, {
      actual, expected, operator: 'deepStrictEqual',
    });
  }
}

function matches(error, expected) {
  if (expected === undefined) return true;
  if (typeof expected === 'function') {
    if (expected.prototype !== undefined && error instanceof expected) return true;
    if (Error.isPrototypeOf(expected) || expected === Error) return false;
    return expected.call({}, error) === true;
  }
  if (expected instanceof RegExp) return expected.test(String(error));
  throw new TypeError('assert shim: only a constructor, a validation function or a RegExp is supported as "expected"');
}

export function throws(fn, expected, message) {
  if (typeof expected === 'string') {
    message = expected;
    expected = undefined;
  }
  let threw = false;
  let error;
  try {
    fn();
  } catch (e) {
    threw = true;
    error = e;
  }
  if (!threw) {
    fail(message, 'Missing expected exception.', { operator: 'throws' });
  }
  if (!matches(error, expected)) throw error;
}

export function doesNotThrow(fn, message) {
  try {
    fn();
  } catch (e) {
    fail(message, `Got unwanted exception.\nActual message: "${e && e.message}"`, {
      actual: e, operator: 'doesNotThrow',
    });
  }
}

assert.AssertionError = AssertionError;
assert.ok = ok;
assert.strictEqual = strictEqual;
assert.notStrictEqual = notStrictEqual;
assert.deepStrictEqual = deepStrictEqual;
assert.throws = throws;
assert.doesNotThrow = doesNotThrow;
