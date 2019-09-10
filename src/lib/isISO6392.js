import assertString from './util/assertString';

const isISO6392Reg = /^[a-z]{3}$/;

export default function isISO6392(str) {
  assertString(str);
  return isISO6392Reg.test(str);
}
