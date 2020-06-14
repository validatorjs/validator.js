/* eslint-disable no-plusplus */
export default function isPermutation(str, pattern, m = {}) {
  pattern.split('').forEach((c) => {
    if (!m[c]) m[c] = 0;
    ++m[c];
  });
  let N = str.length,
    K = pattern.length,
    i = 0,
    j = 0,
    need = K;
  while (j < N) {
    if (m[str[j]]-- > 0 && !--need) return true;
    if (++j - i === K) {
      if (++m[str[i]] > 0) ++need;
      ++i;
    }
  }
  return false;
}

