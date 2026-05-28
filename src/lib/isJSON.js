import assertString from './util/assertString';
import includes from './util/includesArray';
import merge from './util/merge';

const default_json_options = {
  allow_primitives: false,
  allow_any_value: false,
};

export default function isJSON(str, options) {
  assertString(str);
  try {
    options = merge(options, default_json_options);
    const obj = JSON.parse(str);

    // When allow_any_value is true, accept anything that JSON.parse successfully parses
    if (options.allow_any_value) {
      return true;
    }

    let primitives = [];
    if (options.allow_primitives) {
      primitives = [null, false, true];
    }

    return includes(primitives, obj) || (!!obj && typeof obj === 'object');
  } catch (e) { /* ignore */ }
  return false;
}
