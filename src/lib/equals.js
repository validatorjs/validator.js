import assertString from './util/assertString';

const deafaultOptions = { sensitivity: undefined, locales: undefined };
export default function equals(str, comparison, options = deafaultOptions) {
  assertString(str);
  return (options.sensitivity === undefined) ?
    (str === comparison) :
    str.localeCompare(comparison, options.locales, { sensitivity: options.sensitivity }) === 0;
}
