export default function merge(obj = { }, defaults) { // eslint-disable-line default-param-last
  for (const key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }
  return obj;
}
