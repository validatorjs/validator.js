export default function assertNumber(input) {
  const isNumber = typeof input === "number" || input instanceof Number;

  if (!isNumber) {
    let invalidType = typeof input;
    if (input === null) invalidType = "null";
    else if (invalidType === "object") invalidType = input.constructor.name;

    throw new TypeError(`Expected a number but received a ${invalidType}`);
  }
}
