// eslint-disable-next-line default-param-last
export default function merge(obj = {}, defaults) {
  for (const key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }
  return obj;
}
