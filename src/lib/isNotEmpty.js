import assertString from './util/assertString';
import isEmpty from './isEmpty';

export default function isNotEmpty(str) {
  assertString(str);
  return !isEmpty(str);
}
