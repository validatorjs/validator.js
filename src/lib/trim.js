import rtrim from './rtrim.js';
import ltrim from './ltrim.js';

export default function trim(str, chars) {
  return rtrim(ltrim(str, chars), chars);
}
