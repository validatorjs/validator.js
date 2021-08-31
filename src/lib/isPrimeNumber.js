import assertString from './util/assertString';

export default function isPrimeNumber(str) {
  assertString(str);
  let n = str;
  if (isNaN(n) || !isFinite(n) || n % 1 || n < 2) return false;
  var m = Math.sqrt(n); 
  for (var i = 2; i <= m; i++)
      if (n % i == 0) return false;
  return true;
}
