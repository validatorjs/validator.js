export default function assertString(input) {
  if (input === undefined || input === null) throw new TypeError(`Expected a string but received a ${input}`);
  if (typeof input !== 'string' && !(input instanceof String)) throw new TypeError(`Expected a string but received a ${input?.constructor?.name ?? typeof input}`)
}
