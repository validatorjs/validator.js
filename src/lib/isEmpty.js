import assertString from './util/assertString';
import merge from './util/merge';

const default_is_empty_options = {
  ignore_whitespace: false,
  to_string: false,
};

export default function isEmpty(str, options) {
  let emptyValues = [undefined, null, [], false, 0, '', '0'];

  options = merge(options, default_is_empty_options);

  if (options.to_string) {
    assertString(str);
  }

  if (options.ignore_whitespace) {
    str = str.trim().length;
  }

  for (let i = 0; i < emptyValues.length; i++) {
    if (str === emptyValues[i]) {
      return true;
    }
  }

  if (typeof str === 'object') {
    for (let key in str) {
      if (str.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  return false;
}
