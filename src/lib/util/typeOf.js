/**
 * Better way to handle type checking
 * null, {}, array and date are objects, which confuses
 */
export default function typeOf(input) {
  const rawObject = Object.prototype.toString.call(input).toLowerCase();
  const typeOfRegex = /\[object (.*)]/g;
  const type = typeOfRegex.exec(rawObject)[1];
  return type;
}
