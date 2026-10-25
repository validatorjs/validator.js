// ES5 equivalent of `str.endsWith(suffix)`; String.prototype.endsWith is ES2015.
export default function endsWith(str, suffix) {
  suffix = String(suffix);
  return str.length >= suffix.length && str.slice(str.length - suffix.length) === suffix;
}
