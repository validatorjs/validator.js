function getType(input) {
  let invalidType;

  if (input === null) {
    invalidType = 'null';
  } else {
    invalidType = typeof input;
    if (invalidType === 'object' && input.constructor && input.constructor.hasOwnProperty('name')) {
      invalidType = input.constructor.name;
    } else {
      invalidType = `a ${invalidType}`;
    }
  }
}

export default function assertString(input) {
  const isString = (typeof input === 'string' || input instanceof String);

  if (!isString) {
    throw new TypeError(`Expected string but received ${getType(input)}.`);
  }
}
