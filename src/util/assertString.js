export default function assertString(input) {
  if (typeof input !== 'string') {
    if (process.env.NODE_ENV === 'node') {
      require('depd')('validator')(
        `you tried to validate a ${typeof input} but this library ` +
        '(validator.js) validates strings only.'
      );
    }
    throw new Error('this library validates strings only');
  }
}
