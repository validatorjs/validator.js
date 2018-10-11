import assertString from './util/assertString';
import merge from './util/merge';

const default_is_jwt_options = {
  prefix: undefined,
};

export default function isJWT(str, options) {
  assertString(str);
  options = merge(options, default_is_jwt_options);

  if (options.prefix) {
    let final_pattern = '^{{pattern}} [a-zA-Z0-9\\-_]+\\.[a-zA-Z0-9\\-_]+\\.[a-zA-Z0-9\\-_]+$';

    return new RegExp(final_pattern.replace('{{pattern}}', options.prefix)).test(str);
  }

  return /^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/.test(str);
}
