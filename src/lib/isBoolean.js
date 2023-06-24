import assertString from './util/assertString';

const defaultOptions = { loose: false };
const strictBooleans = ['true', 'false', '1', '0'];
const looseBooleans = [...strictBooleans, 'yes', 'no'];

export default function isBoolean(str, options = defaultOptions) {
  assertString(str);

  if (options.loose) {
    return looseBooleans.includes(str.toLowerCase());
  }

  return strictBooleans.includes(str);
}
