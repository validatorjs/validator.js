import assertString from './util/assertString';
import merge from './util/merge';

function isValidBase64Char(code, urlSafe) {
  // A-Z (65-90), a-z (97-122), 0-9 (48-57)
  if ((code >= 65 && code <= 90)
    || (code >= 97 && code <= 122)
    || (code >= 48 && code <= 57)) {
    return true;
  }
  if (urlSafe) {
    return code === 45 || code === 95; // - _
  }
  return code === 43 || code === 47; // + /
}

export default function isBase64(str, options) {
  assertString(str);
  options = merge(options, { urlSafe: false, padding: !options?.urlSafe });

  if (str === '') return true;

  if (options.padding && str.length % 4 !== 0) return false;

  if (options.padding) {
    // Count trailing '=' padding
    let paddingCount = 0;
    let len = str.length;
    while (paddingCount < len && str.charCodeAt(len - 1 - paddingCount) === 61) {
      paddingCount += 1;
    }
    if (paddingCount > 2) return false;

    const dataLen = len - paddingCount;

    for (let i = 0; i < dataLen; i++) {
      if (!isValidBase64Char(str.charCodeAt(i), options.urlSafe)) return false;
    }
  } else {
    // No padding allowed — all chars must be valid base64
    for (let i = 0; i < str.length; i++) {
      if (!isValidBase64Char(str.charCodeAt(i), options.urlSafe)) return false;
    }
  }

  return true;
}
