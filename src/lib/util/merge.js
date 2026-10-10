export default function merge(obj = { }, defaults) {
  if (typeof obj !== 'object' || obj === null) {
    obj = {};
  }
  for (const key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }
  return obj;
}
