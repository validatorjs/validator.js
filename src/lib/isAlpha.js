import { ALPHA, validateAlpha } from './alpha';

export default function isAlpha(_str, options) {
  return validateAlpha(_str, options);
}

export const locales = Object.keys(ALPHA);
