import assertString from './util/assertString.js';
import toString from './util/toString.js';
import merge from './util/merge.js';

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
