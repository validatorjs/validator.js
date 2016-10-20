import { assertString } from './util/assertString';

export const unescape = (str) => {
  assertString(str);
  return (str.replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#x2F;/g, '/')
        .replace(/&#96;/g, '`'));
}
