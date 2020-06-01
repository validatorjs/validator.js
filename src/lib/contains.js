import assertString from './util/assertString';
import toString from './util/toString';
import merge from './util/merge';

const defaulContainsOptions = {
  ignoreCase: false,
};

export default function contains(str, elem, options) {
  assertString(str);
  options = merge(options, defaulContainsOptions);
  return options.ignoreCase ?
    str.toLowerCase().indexOf(toString(elem).toLowerCase()) >= 0 :
    str.indexOf(toString(elem)) >= 0;
}
