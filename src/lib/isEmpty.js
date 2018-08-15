import assertString from './util/assertString';
import merge from './util/merge';

const default_is_empty_options = {
  whitespace_only_as_empty: false,
};

export default function isEmpty(str, options) {
  assertString(str);
  options = merge(options, default_is_empty_options);

  return (options.whitespace_only_as_empty ? str.trim().length : str.length) === 0;
}
