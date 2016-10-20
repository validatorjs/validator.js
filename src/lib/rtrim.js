import { assertString } from './util/assertString';

export const rtrim = (str, chars) => {
  assertString(str);
  const pattern = chars ? new RegExp(`[${chars}]`) : /\s/;

  let idx = str.length - 1;
  while (idx >= 0 && pattern.test(str[idx])) {
    idx--;
  }

  return idx < str.length ? str.substr(0, idx + 1) : str;
}
