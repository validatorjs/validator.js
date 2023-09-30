export default function validateKey(object, key, errorMessage) {
  if (object[key] === undefined) {
    throw new Error(errorMessage);
  }
  return true;
}
