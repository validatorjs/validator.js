import assertString from './util/assertString';

export default function toCamelCase(inputString) {
  assertString(inputString);

  const words = inputString.split(/[\s\-_]+/);

  words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return words.join('');
}
