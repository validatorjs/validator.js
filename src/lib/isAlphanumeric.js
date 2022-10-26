import { alphanumeric, validateAlphanumeric } from './alpha';

export default function isAlphanumeric(_str, ...args) {
  return validateAlphanumeric(_str, ...args);
}

export const locales = Object.keys(alphanumeric);
