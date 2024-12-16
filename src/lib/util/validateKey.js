export default function validateKey(object, key, errorMessage) {
  if (object.hasOwnProperty(key)) {
    return true;
  }
  throw new Error(errorMessage);
}
