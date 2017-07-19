import assertString from './util/assertString';

const decimal = /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/;

export default function isDecimal(str, options) {
  assertString(str);
  options = options || {};
  return str !== '' && decimal.test(str) &&
    (!options.hasOwnProperty('digitsAfterDecPoint') || str.indexOf('.') === -1 || str.length - str.indexOf('.') - 1 <= options.digitsAfterDecPoint);
}
