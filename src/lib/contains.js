import assertString from './util/assertString';
import toString from './util/toString';
import merge from './util/merge';

const defaulContainsOptions = {
  ignoreCase: false,
  minOccurrences: 1,
};

export default function contains(str, elem, options) {
  assertString(str);
  options = merge(options, defaulContainsOptions);

  const regex = new RegExp(toString(elem), `g${options.ignoreCase ? 'i' : ''}`);

  return (str.match(regex) || []).length >= options.minOccurrences;
}
