import assertString from './util/assertString';
import toString from './util/toString';

export default function validate_password(str) {
  assertString(str);
  var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  return (/[a-z]/.test(str)) && (/[A-Z]/.test(str)) && (/[\d]/.test(str)) && format.test(str);
}
