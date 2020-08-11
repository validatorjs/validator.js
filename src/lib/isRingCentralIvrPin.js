import assertString from './util/assertString';

let ivrPinRegex = new RegExp(/(012|123|234|345|456|567|678|789|987|876|765|654|543|432|210|000|111|222|333|444|555|666|777|888|999)/, 'i');

export default function isRingCentralIvrPin(str) {
  assertString(str);

  return !ivrPinRegex.test(str);
}
