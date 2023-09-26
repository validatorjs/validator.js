import assertString from './util/assertString';


export default function isPUC(str) {
  assertString(str);
  const upcRegex = /^\d{12}$/;
  return upcRegex.test(str);
}
