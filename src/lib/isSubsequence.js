import assertString from './util/assertString';

export default function isSubsequence(a, b) {
  const a_length = a.length;
  const b_length = b.length;
  let a_index = 0;
  let b_index = 0;
  assertString(a);
  assertString(b);
  for (a_index = 0; a_index < a_length && b_index < b_length; a_index += 1) {
    if (a.charAt(a_index) === b.charAt(b_index)) {
      b_index += 1;
    }
  }
  return (b_index === b_length);
}
