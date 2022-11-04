import assertString from './util/assertString';
import includes from './util/includesArray';

const defaultOptions = { loose: false };
const strictBooleans = ['true', 'false', '1', '0'];
const looseBooleans = [...strictBooleans, 'yes', 'no'];

export default function isBoolean(str, options = defaultOptions) {
  assertString(str);

  if (options.loose) {
    return includes(looseBooleans, str.toLowerCase());
  }

  return includes(strictBooleans, str);
}
