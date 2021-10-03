import assertString from './util/assertString';

const isValidClassNameRegx = /^[_a-zA-Z-]+[_a-zA-Z0-9]*/;

export default function isValidClassName(str) {
  assertString(str);

  if (str.length <= 1) {
    return false;
  }

  if (/^-[-0-9]/.test(str)) {
    return false;
  }

  return (isValidClassNameRegx.test(str));
}
