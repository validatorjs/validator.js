export function assertStringOrNumber(input) {
  const isStringOrNumber = (
    (typeof input === 'string' || input instanceof String)
    || (typeof input === 'number' || input instanceof Number)
  );

  if (!isStringOrNumber) {
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
    throw new TypeError(`Expected string/number but received ${invalidType}.`);
  }
}

export default assertStringOrNumber;
