import assertString from "./util/assertString";

const upcRegex = /^\d{12}$/;

export default function isPUC(str) {
  assertString(str);
  return upcRegex.test(code);
}
