import assertString from './util/assertString';
import merge from './util/merge';
var default_is_empty_options = {
  ignore_whitespace: false,
  to_string: false
};
export default function isEmpty(str, options) {
  var emptyValues = [undefined, null, [], NaN, false, 0, '', '0'];
  options = merge(options, default_is_empty_options);

  if (options.to_string) {
    assertString(str);
  }

  if (options.ignore_whitespace) {
    str = str.trim().length;
  }

  for (var i = 0; i < emptyValues.length; i++) {
    if (str === emptyValues[i]) {
      return true;
    }
  }

  return false;
}