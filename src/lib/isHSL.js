import assertString from './util/assertString';

const hsl = /^(hsl)\(\s*(\+|\-)?0*[0-9]+\s*,\s*0*(0?[0-9]?[0-9]|100)%\s*,\s*0*(0?[0-9]?[0-9]|100)%\s*\)$/i;

export default function isHSL(str) {
  assertString(str);
  return hsl.test(str);
}
