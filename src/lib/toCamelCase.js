import assertString from './util/assertString';

export default function toCamelCase(inputString) {
  assertString(inputString);

  const words = inputString.split(/[\s\-_]+/);

  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].substr(0, 1).toUpperCase() + words[i].substr(1);
  }

  return words.join('');
}
