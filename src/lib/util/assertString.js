export default function assertString(input) {
  const isString = (typeof input === 'string' || input instanceof String);

  if (!isString) {
    let invalidType;
    if (input === null) {
      invalidType = 'null';
    } else {
      invalidType = typeof input;
      if (invalidType === 'object' && input.constructor) {
        invalidType = input.constructor.name;
      } else {
        invalidType = `a ${invalidType}`;
      }
    }
    let message = 'This library (validator.js) validates strings only, ';
    message += `instead it received ${invalidType}.`;
    throw new TypeError(message);
  }
}
