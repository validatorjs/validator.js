// The name of a value's constructor. Engines without Function#name (IE 11)
// fall back to the name in the constructor's source.
function constructorName(input) {
  const ctor = input.constructor;
  if (!ctor) return String(ctor);
  if (ctor.name || typeof ctor !== 'function') return ctor.name;
  const match = /^\s*function\s*([\w$]+)/.exec(Function.prototype.toString.call(ctor));
  return match ? match[1] : '';
}

export default function assertString(input) {
  if (input === undefined || input === null) throw new TypeError(`Expected a string but received a ${input}`);
  const name = constructorName(input);
  if (name !== 'String') throw new TypeError(`Expected a string but received a ${name}`);
}
