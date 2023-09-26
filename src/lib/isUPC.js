import assertString from './util/assertString';


export default function isUPC(str) {
  assertString(str);
  const upcRegex = /^\d{12}$/;
  return upcRegex.test(str);
}
