export default function assertString(input) {
  const isString = (typeof input === 'string' || input instanceof String);

  if (!isString) {
    throw new TypeError('This library (validator.js) validates strings only');
  }
}
