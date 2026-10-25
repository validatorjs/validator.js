// ES5 equivalent of `str.startsWith(prefix)`; String.prototype.startsWith is ES2015.
export default function startsWith(str, prefix) {
  prefix = String(prefix);
  return str.slice(0, prefix.length) === prefix;
}
