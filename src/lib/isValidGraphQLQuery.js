import assertString from './util/assertString';
import { parse } from 'graphql';
import merge from './util/merge';

const default_json_options = {
  allow_primitives: false,
};

export default function isValidGraphQLQuery(input, options) {
  assertString(input);
  try {
    options = merge(options, default_json_options);
    let primitives = [];
    if (options.allow_primitives) {
      primitives = [null, false, true];
    }

    const obj = parse(input);
    return includes(primitives, obj) || (!!obj && typeof obj === 'object');
  } catch (e) {
    return false;
  };
}
