export default function assertString(input) {
  if (typeof input !== 'string') {
    throw new Error('this library validates strings only');
  }
}
