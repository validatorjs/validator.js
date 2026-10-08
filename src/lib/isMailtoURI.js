import trim from './trim';
import isEmail from './isEmail';
import assertString from './util/assertString';

const recipientControlCharacters = /[\x00-\x1F\x7F]/; // eslint-disable-line no-control-regex

function parseMailtoQueryString(queryString) {
  const allowedParams = new Set(['subject', 'body', 'cc', 'bcc']),
    query = { cc: '', bcc: '' };
  let isParseFailed = false;

  const queryParams = queryString.split('&');

  if (queryParams.length > 4) {
    return false;
  }

  for (const q of queryParams) {
    const [key, value] = q.split('=');

    // checked for invalid and duplicated query params
    if (key && !allowedParams.has(key)) {
      isParseFailed = true;
      break;
    }

    if (value && (key === 'cc' || key === 'bcc')) {
      query[key] = value;
    }

    if (key) {
      allowedParams.delete(key);
    }
  }

  return isParseFailed ? false : query;
}

export default function isMailtoURI(url, options) {
  assertString(url);

  if (url.indexOf('mailto:') !== 0) {
    return false;
  }

  const [to, queryString = ''] = url.replace('mailto:', '').split('?');

  if (!to && !queryString) {
    return true;
  }

  const query = parseMailtoQueryString(queryString);

  if (!query) {
    return false;
  }

  return `${to},${query.cc},${query.bcc}`
    .split(',')
    .every((email) => {
      email = trim(email, ' ');

      if (email) {
        try {
          email = decodeURIComponent(email);
        } catch (e) {
          return false;
        }
        return !recipientControlCharacters.test(email) && isEmail(email, options);
      }

      return true;
    });
}
