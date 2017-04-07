export default function assertString(input) {
  if (typeof input !== 'string' && input) {
    throw new TypeError('This library (validator.js) validates strings and false only');
  }
  return (input || '');
}
