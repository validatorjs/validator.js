import assertString from './util/assertString';

export default function isJSON(str) {
  if (typeof str === 'object') {
    return true;
  }
  assertString(str);
  try {
    const obj = JSON.parse(str);
    return !!obj && typeof obj === 'object';
  } catch (e) { /* ignore */ }
  return false;
}
