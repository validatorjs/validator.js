export default function isDate(input) {
  if (typeof input === 'string') {
    return isFinite(Date.parse(input));
  }
  return Object.prototype.toString.call(input) === '[object Date]' && isFinite(input);
}
