import { assertString } from './util/assertString';

const decimal = /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/;

export const isDecimal = (str) => {
  assertString(str);
  return str !== '' && decimal.test(str);
}
