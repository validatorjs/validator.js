export default function merge(obj = { }, defaults) {
  // Copy `obj` instead of mutating it, so that a caller's options object is not
  // modified as a side effect (and a frozen options object does not throw).
  const result = (typeof obj !== 'object' || obj === null) ? {} : { ...obj };
  for (const key in defaults) {
    if (typeof result[key] === 'undefined') {
      result[key] = defaults[key];
    }
  }
  return result;
}
