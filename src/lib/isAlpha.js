import { alpha, validateAlpha } from './alpha';

export default function isAlpha(_str, ...args) {
  return validateAlpha(_str, ...args);
}

export const locales = Object.keys(alpha);
