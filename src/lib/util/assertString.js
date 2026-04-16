export default function assertString(input) {
  if (input === undefined || input === null) throw new TypeError(`Expected a string but received a ${input}`);
  if (typeof input !== 'string' && !(input instanceof String)) {
    let inputConstructorName = input?.constructor?.name ? input.constructor.name : typeof input;
    throw new TypeError(`Expected a string but received a ${inputConstructorName}`);
  }
}
