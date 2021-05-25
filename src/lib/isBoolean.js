import assertString from './util/assertString';

const defaultOptions = { loose: false };

export default function isBoolean(str, options = defaultOptions) {
  assertString(str);

  const strictBooleans = ['true', 'false', '1', '0'];
  const looseBooleans = [...strictBooleans, 'yes', 'no'];

  if (options.loose) {
    return (looseBooleans.indexOf(str.toLowerCase()) >= 0);
  }

  return (strictBooleans.indexOf(str) >= 0);
}
