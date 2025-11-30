import assertString from './util/assertString';
import isIP from './isIP';

const MULTIPLE_SPACES_REGEX = / {2,}/g;
const INVALID_PERCENT_REGEX = /%(?![0-9A-Fa-f]{2})/;
const SCHEME_REGEX = /^[A-Za-z][A-Za-z0-9+.-]*$/;
const BACKSLASH_REGEX = /\\/;
const DISALLOWED_ASCII_REGEX = /["<>^`{}|]/;
const OPEN_BRACKET_PLACEHOLDER = '__VALIDATOR_OPEN_BRACKET__';
const CLOSE_BRACKET_PLACEHOLDER = '__VALIDATOR_CLOSE_BRACKET__';

const HEX_DIGIT = '[0-9A-Fa-f]';
const PCT_ENCODED = `%${HEX_DIGIT}{2}`;
const UNRESERVED = 'A-Za-z0-9\\-._~';
const SUB_DELIMS = "!$&'()*+,;=";
const PCHAR = `(?:[${UNRESERVED}]|${PCT_ENCODED}|[${SUB_DELIMS}:@])`;
const SEGMENT = `(?:${PCHAR})*`;
const SEGMENT_NZ = `(?:${PCHAR})+`;
const SEGMENT_NZ_NC = `(?:${PCT_ENCODED}|[${UNRESERVED}${SUB_DELIMS}@])+`;

const PATH_ABEMPTY_REGEX = new RegExp(`^(?:/${SEGMENT})*$`);
const PATH_ABSOLUTE_REGEX = new RegExp(`^/(?:${SEGMENT_NZ}(?:/${SEGMENT})*)?$`);
const PATH_ROOTLESS_REGEX = new RegExp(`^${SEGMENT_NZ}(?:/${SEGMENT})*$`);
const PATH_NOSCHEME_REGEX = new RegExp(`^(?:${SEGMENT_NZ_NC})(?:/${SEGMENT})*$`);
const QUERY_FRAGMENT_REGEX = new RegExp(`^(?:${PCHAR}|[/?])*$`);
const USERINFO_REGEX = new RegExp(`^(?:${PCT_ENCODED}|[${UNRESERVED}${SUB_DELIMS}:])*$`);
const REG_NAME_REGEX = new RegExp(`^(?:${PCT_ENCODED}|[${UNRESERVED}${SUB_DELIMS}])*$`);
const IPV_FUTURE_REGEX = /^v[0-9A-F]+\.[A-Za-z0-9._~!$&'()*+,;=:-]+$/i;

function collapseXmlWhitespace(input) {
  let normalized = '';

  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i);

    if (code === 0x09 || code === 0x0a || code === 0x0d) {
      normalized += ' ';
    } else {
      normalized += input[i];
    }
  }

  return normalized.replace(MULTIPLE_SPACES_REGEX, ' ').trim();
}

function containsForbiddenControl(value) {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);

    if (
      (code >= 0x00 && code <= 0x08) ||
      code === 0x0b ||
      code === 0x0c ||
      (code >= 0x0e && code <= 0x1f) ||
      code === 0x7f
    ) {
      return true;
    }
  }

  return false;
}

function hasInvalidPercentEncoding(input) {
  return INVALID_PERCENT_REGEX.test(input);
}

function isIPvFuture(address) {
  return IPV_FUTURE_REGEX.test(address);
}

function isValidAuthority(authority, options) {
  const allowEmptyAuthority = Boolean(options && options.allowEmptyAuthority);
  if (authority === '') {
    return !!allowEmptyAuthority;
  }

  let hostPort = authority;
  let userinfo = '';
  const atIndex = authority.lastIndexOf('@');

  if (atIndex !== -1) {
    userinfo = authority.slice(0, atIndex);
    hostPort = authority.slice(atIndex + 1);

    if (!USERINFO_REGEX.test(userinfo)) {
      return false;
    }
  }

  let host = hostPort;
  let port = null;
  let hasHost = false;

  if (hostPort.startsWith('[')) {
    const closingIndex = hostPort.indexOf(']');

    if (closingIndex === -1) {
      return false;
    }

    const address = hostPort.slice(1, closingIndex);

    if (!isIP(address, 6) && !isIPvFuture(address)) {
      return false;
    }

    const remainder = hostPort.slice(closingIndex + 1);

    if (remainder) {
      if (!remainder.startsWith(':')) {
        return false;
      }

      port = remainder.slice(1);
    }

    host = '';
    hasHost = true;
  } else {
    const firstColon = hostPort.indexOf(':');
    const lastColon = hostPort.lastIndexOf(':');

    if (firstColon !== lastColon) {
      return false;
    }

    if (lastColon !== -1) {
      host = hostPort.slice(0, lastColon);
      port = hostPort.slice(lastColon + 1);
    }

    if (host) {
      hasHost = true;

      if (!isIP(host, 4) && !REG_NAME_REGEX.test(host)) {
        return false;
      }
    }
  }

  if (!hasHost) {
    return false;
  }

  if (port !== null) {
    if (port === '' || !/^[0-9]+$/.test(port)) {
      return false;
    }

    const portNumber = parseInt(port, 10);

    if (Number.isNaN(portNumber) || portNumber > 65535) {
      return false;
    }
  }

  return true;
}

function isValidPath(path, { hasAuthority, hasScheme }) {
  if (hasAuthority) {
    return PATH_ABEMPTY_REGEX.test(path);
  }

  if (hasScheme) {
    if (path === '') {
      return true;
    }

    if (path.startsWith('/')) {
      return PATH_ABSOLUTE_REGEX.test(path);
    }

    return PATH_ROOTLESS_REGEX.test(path);
  }

  if (path === '') {
    return true;
  }

  if (path.startsWith('/')) {
    return PATH_ABSOLUTE_REGEX.test(path);
  }

  return PATH_NOSCHEME_REGEX.test(path);
}

function isValidQueryOrFragment(value) {
  return value === '' || QUERY_FRAGMENT_REGEX.test(value);
}

function isValidUriReference(value) {
  let rest = value;
  let scheme = null;
  let hadScheme = false;

  const colonIndex = rest.indexOf(':');

  if (colonIndex > 0) {
    const potentialScheme = rest.slice(0, colonIndex);

    if (SCHEME_REGEX.test(potentialScheme)) {
      scheme = potentialScheme;
      hadScheme = true;
      rest = rest.slice(colonIndex + 1);
    }
  }

  let fragment = '';
  const hashIndex = rest.indexOf('#');

  if (hashIndex !== -1) {
    fragment = rest.slice(hashIndex + 1);
    rest = rest.slice(0, hashIndex);

    if (!isValidQueryOrFragment(fragment)) {
      return false;
    }
  }

  let query = '';
  const questionIndex = rest.indexOf('?');

  if (questionIndex !== -1) {
    query = rest.slice(questionIndex + 1);
    rest = rest.slice(0, questionIndex);

    if (!isValidQueryOrFragment(query)) {
      return false;
    }
  }

  let hasAuthority = false;
  let authority = '';
  let path = rest;

  if (rest.startsWith('//')) {
    hasAuthority = true;
    rest = rest.slice(2);
    const nextSlash = rest.indexOf('/');

    if (nextSlash === -1) {
      authority = rest;
      path = '';
    } else {
      authority = rest.slice(0, nextSlash);
      path = rest.slice(nextSlash);
    }

    const allowEmptyAuthority = Boolean(hadScheme && scheme && scheme.toLowerCase() === 'file');
    const authorityOptions = allowEmptyAuthority
      ? { allowEmptyAuthority: true }
      : undefined;

    if (!isValidAuthority(authority, authorityOptions)) {
      return false;
    }
  }

  return isValidPath(path, { hasAuthority, hasScheme: hadScheme });
}

export default function isXsdAnyURI(input) {
  assertString(input);

  let value = collapseXmlWhitespace(input);

  if (value === '') {
    return true;
  }

  if (
    containsForbiddenControl(value) ||
    hasInvalidPercentEncoding(value) ||
    BACKSLASH_REGEX.test(value) ||
    DISALLOWED_ASCII_REGEX.test(value)
  ) {
    return false;
  }

  let encoded;

  try {
    const bracketSafeValue = value
      .replace(/\[/g, OPEN_BRACKET_PLACEHOLDER)
      .replace(/\]/g, CLOSE_BRACKET_PLACEHOLDER);

    const encodedWithPlaceholders = encodeURI(bracketSafeValue);

    encoded = encodedWithPlaceholders
      .split(OPEN_BRACKET_PLACEHOLDER)
      .join('[')
      .split(CLOSE_BRACKET_PLACEHOLDER)
      .join(']');
  } catch (err) {
    return false;
  }

  return isValidUriReference(encoded);
}
