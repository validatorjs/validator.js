import { ALPHANUMERIC, validateAlphanumeric } from './alpha';

export default function isAlphanumeric(_str, options) {
  return validateAlphanumeric(_str, options);
}

export const locales = Object.keys(ALPHANUMERIC);
