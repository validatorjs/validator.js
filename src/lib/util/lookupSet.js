/**
 * Builds a lookup table with a `has(value)` method from a list of strings.
 *
 * Where the runtime provides `Set`, this returns a native `Set`, so exported
 * tables such as `CountryCodes` keep their type. Elements are added one by
 * one because IE 11 ignores the iterable argument of the `Set` constructor.
 * On ES5 runtimes without `Set` (e.g. Node.js 0.10), it returns a minimal
 * object whose `has()` answers like `Set.prototype.has` for these values.
 */
export default function lookupSet(values) {
  /* eslint-disable no-restricted-globals */
  if (typeof Set === 'function') {
    const set = new Set();
    values.forEach((value) => {
      set.add(value);
    });
    return set;
  }
  /* eslint-enable no-restricted-globals */

  const table = {};
  values.forEach((value) => {
    table[value] = true;
  });
  return {
    has(value) {
      return typeof value === 'string' && Object.prototype.hasOwnProperty.call(table, value);
    },
  };
}
