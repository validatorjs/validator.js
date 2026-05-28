export default function toString(input) {
  if (typeof input === 'object' && input !== null) {
    if (typeof input.toString === 'function') {
      input = input.toString();
    } else {
      input = '[object Object]';
    }
  } else if (input === null || typeof input === 'undefined' || (isNaN(input) && !input.length)) {
    input = '';
  }
  return String(input);
}
