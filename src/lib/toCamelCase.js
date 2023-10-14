export default function toCamelCase(inputString) {

  // If the input string is empty, return an empty string
  if (typeof inputString !== 'string' || inputString.length === 0) {
    return null;
  }

  // Split the input string into words using spaces, hyphens, or underscores as separators
  const words = inputString.split(/[\s\-_]+/);

  // Capitalize the first letter of each word except the first one
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Join the words back together to form the camelCase string
  return words.join('');
}
