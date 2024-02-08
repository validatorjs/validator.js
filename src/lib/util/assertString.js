const assertString = (input) => {
  if (!input) throw new TypeError(`Expected a string but received a ${input || 'null'}`);
  if (input.constructor.name !== 'String') throw new TypeError(`Expected a string but received a ${input.constructor.name}`);
};

export default assertString;
