import assertString from './util/assertString';
import merge from './util/merge';

function regexExp(options) {
  const alphabets = options.alphabets;
  const underscore = options.underscore ? '_' : '';
  const hyphen = options.hyphen ? '-' : '';
  const charClass = `${alphabets}${underscore}${hyphen}`;
  const regExp = new RegExp(`^[${charClass}]{${options.length}}$`);
  return regExp;
}

const default_options = {
  alphabets: 'A-Za-z0-9',
  length: '1,',
  hyphen: true,
  underscore: true,
};

export default function isNanoID(str, options) {
  assertString(str);
  options = merge(options, default_options);
  return regexExp(options).test(str);
}

isNanoID('ABC456', { alphabets: 'ABCDEF123456' });
