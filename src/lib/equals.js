import assertString from './util/assertString';

const defaultOptions = {
  // set the sensitivity mode ''' base | accent | varient '''
  sensitivity: undefined,
  // set local language for ex 'en'
  locales: undefined,
};

export default function equals(str, comparison, options = defaultOptions) {
  assertString(str);

  return (options.sensitivity === undefined) ?
    (str === comparison) :
    str.localeCompare(comparison, options.locales, { sensitivity: options.sensitivity }) === 0;
}
