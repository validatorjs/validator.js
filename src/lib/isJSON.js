import assertString from './util/assertString';
import includes from './util/includesArray';
import merge from './util/merge';

const default_json_options = {
  allow_primitives: false,
};

export default function isJSON(str, options) {
  assertString(str);
  try {
    options = merge(options, default_json_options);
    let primitives = [];
    if (options.allow_primitives) {
      primitives = [null, false, true];
    }

    const obj = JSON.parse(str);
    return includes(primitives, obj) || (!!obj && typeof obj === 'object');
  } catch (e) { /* ignore */ }
  return false;
}
