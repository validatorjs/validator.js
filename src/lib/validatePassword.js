import assertString from './util/assertString';

export default function validatePassword(str) {
  const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  assertString(str);
  return (/[a-z]/.test(str)) && (/[A-Z]/.test(str)) && (/[\d]/.test(str)) && format.test(str);
}
