import assertString from './util/assertString';
import checkHost from './util/checkHost';
import includes from './util/includesString';

import isFQDN from './isFQDN';
import isIP from './isIP';
import merge from './util/merge';

/*
options for isURL method

protocols - valid protocols can be modified with this option.
require_tld - If set to false isURL will not check if the URL's host includes a top-level domain.
require_protocol - if set to true isURL will return false if protocol is not present in the URL.
require_host - if set to false isURL will not check if host is present in the URL.
require_port - if set to true isURL will check if port is present in the URL.
require_valid_protocol - isURL will check if the URL's protocol is present in the protocols option.
allow_underscores - if set to true, the validator will allow underscores in the URL.
host_whitelist - if set to an array of strings or regexp, and the domain matches none of the strings
                 defined in it, the validation fails.
host_blacklist - if set to an array of strings or regexp, and the domain matches any of the strings
                 defined in it, the validation fails.
allow_trailing_dot - if set to true, the validator will allow the domain to end with
                     a `.` character.
allow_protocol_relative_urls - if set to true protocol relative URLs will be allowed.
allow_fragments - if set to false isURL will return false if fragments are present.
allow_query_components - if set to false isURL will return false if query components are present.
disallow_auth - if set to true, the validator will fail if the URL contains an authentication
                component, e.g. `http://username:password@example.com`
validate_length - if set to false isURL will skip string length validation. `max_allowed_length`
                  will be ignored if this is set as `false`.
max_allowed_length - if set, isURL will not allow URLs longer than the specified value (default is
                     2084 that IE maximum URL length).

*/

const default_url_options = {
  protocols: ['http', 'https', 'ftp'],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_port: false,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
  allow_fragments: true,
  allow_query_components: true,
  validate_length: true,
  max_allowed_length: 2084,
};

export default function isURL(url, options) {
  assertString(url);
  if (!url || /[\s<>]/.test(url)) {
    return false;
  }
  if (url.indexOf('mailto:') === 0) {
    return false;
  }

  // Security check: Reject URLs with Unicode characters that could be dangerous protocol spoofs
  // Convert full-width Unicode to ASCII and check for dangerous protocols
  const normalizedUrl = url.replace(/[\uFF00-\uFFEF]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 0xFF01 && code <= 0xFF5E) {
      return String.fromCharCode(code - 0xFEE0);
    }
    return char;
  });

  /* eslint-disable no-script-url */
  const dangerousProtocolPrefixes = ['javascript:', 'data:', 'vbscript:'];
  /* eslint-enable no-script-url */
  if (dangerousProtocolPrefixes.some(protocol =>
    normalizedUrl.toLowerCase().startsWith(protocol))) {
    return false;
  } options = merge(options, default_url_options);

  if (options.validate_length && url.length > options.max_allowed_length) {
    return false;
  }

  if (!options.allow_fragments && includes(url, '#')) {
    return false;
  }

  if (
    !options.allow_query_components &&
    (includes(url, '?') || includes(url, '&'))
  ) {
    return false;
  }

  let originalUrl = url;
  let hasProtocol = false;
  let isProtocolRelative = false;

  // Check for multiple slashes like ////foobar.com or http:////foobar.com
  // But allow file:/// which is a valid file URL pattern
  if (
    url.startsWith('///') ||
    (originalUrl.match(/:\/\/\/\/+/) && !originalUrl.startsWith('file:///'))
  ) {
    return false;
  }

  // Check for protocol-relative URLs (must start with exactly //)
  if (url.startsWith('//') && !url.startsWith('///')) {
    if (!options.allow_protocol_relative_urls) {
      return false;
    }
    isProtocolRelative = true;
    hasProtocol = true;
    url = `http:${url}`; // Temporarily add protocol for parsing
  } else if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) {
    // Only check for auth-like patterns if there's no :// in the URL (not a real protocol)
    if (!originalUrl.includes('://')) {
      // Special case: check if this looks like auth info rather than a protocol
      // Pattern: word:something@domain (but not common protocols)
      const authLikeMatch = originalUrl.match(/^([^:/@]+):([^@]*@[^/]+)/);
      if (authLikeMatch) {
        const possibleProtocol = authLikeMatch[1].toLowerCase();

        // Normalize Unicode full-width characters to ASCII for security check
        const normalizedProtocol = possibleProtocol.replace(/[\uFF00-\uFFEF]/g, (char) => {
          const code = char.charCodeAt(0);
          // Convert full-width ASCII to regular ASCII
          if (code >= 0xFF01 && code <= 0xFF5E) {
            return String.fromCharCode(code - 0xFEE0);
          }
          return char;
        });

        const knownDangerousProtocols = ['javascript', 'data', 'vbscript'];

        if (!knownDangerousProtocols.includes(possibleProtocol) &&
            !knownDangerousProtocols.includes(normalizedProtocol)) {
          // This looks like auth info, treat as no protocol
          hasProtocol = false; // Important: mark as no protocol since we're adding one
          url = `http://${url}`;
        } else {
          hasProtocol = true;
          // This is a dangerous protocol in auth component (CVE-2025-56200)
          return false;
        }
      } else {
        hasProtocol = true;
      }
    } else {
      hasProtocol = true;
    }
  } else {
    // Single slash should not be treated as protocol-relative
    if (url.startsWith('/') && !url.startsWith('//')) {
      return false;
    }

    // No protocol, add a temporary one for parsing
    url = `http://${url}`;
  }

  let parsedUrl;

  // Special handling for database URLs like postgres://user:pw@/test
  if (
    originalUrl.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^@\/]+@\//) &&
    !options.require_host
  ) {
    // This is a database URL with empty hostname but auth and path
    try {
      // Replace @/ with @localhost/ temporarily for parsing
      const tempUrl = url.replace('@/', '@localhost/');
      parsedUrl = new URL(tempUrl);
      // Clear the hostname since it was fake
      Object.defineProperty(parsedUrl, 'hostname', {
        value: '',
        writable: false,
      });
      Object.defineProperty(parsedUrl, 'host', { value: '', writable: false });
    } catch (e) {
      return false;
    }
  } else {
    // Use native URL constructor for parsing
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return false;
    }
  }

  // Validate protocol
  const protocol = parsedUrl.protocol.slice(0, -1); // Remove trailing ':'
  if (
    hasProtocol &&
    options.require_valid_protocol &&
    !options.protocols.includes(protocol)
  ) {
    return false;
  }
  if (!hasProtocol && options.require_protocol) {
    return false;
  }
  if (isProtocolRelative && options.require_protocol) {
    return false;
  }

  // Handle special case for URLs ending with just protocol:// (should always fail)
  // But allow URLs like file:/// that have paths
  if (
    !parsedUrl.hostname &&
    hasProtocol &&
    originalUrl.endsWith('://') &&
    (!parsedUrl.pathname || parsedUrl.pathname === '/')
  ) {
    return false;
  }

  // Validate host presence
  if (!parsedUrl.hostname && options.require_host) {
    return false;
  }
  if (!parsedUrl.hostname && !options.require_host) {
    return true;
  }

  // Validate port
  if (options.require_port && !parsedUrl.port) {
    return false;
  }
  if (parsedUrl.port) {
    const port = parseInt(parsedUrl.port, 10);
    if (port <= 0 || port > 65535) {
      return false;
    }
  }

  // Validate authentication
  if (options.disallow_auth && (parsedUrl.username || parsedUrl.password)) {
    return false;
  }

  // Additional auth validation for security (multiple colons check)
  if (parsedUrl.username !== '' || parsedUrl.password !== '') {
    // Check the original URL for multiple colons in auth part
    const authMatch = originalUrl.match(/@([^/]+)/);
    if (authMatch) {
      const beforeAuth = originalUrl.substring(
        0,
        originalUrl.indexOf(authMatch[0])
      );
      const authPart = beforeAuth.split('://').pop() || beforeAuth;
      if (authPart.split(':').length > 2) {
        return false;
      }
    }
  }

  // Reject URLs with empty auth components like @example.com, :@example.com, or http://@example.com
  const emptyAuthMatch = originalUrl.match(/^(@|:@|\/\/@[^/]|\/\/:@)/);
  if (emptyAuthMatch) {
    return false;
  }

  // Also check for empty username in parsed URL (handles http://@example.com)
  // But allow empty username if there's a password (http://:pass@example.com)
  if (
    parsedUrl.username === '' &&
    parsedUrl.password === '' &&
    originalUrl.includes('@') &&
    !originalUrl.match(/^[^:]+:@/)
  ) {
    return false;
  }

  // Security check: Reject URLs where username looks like a domain (phishing protection)
  // e.g., http://evil-site.com@example.com should be rejected
  if (parsedUrl.username && parsedUrl.username.includes('.')) {
    // Check if username looks like a domain (has common TLD patterns)
    const usernamePattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (usernamePattern.test(parsedUrl.username)) {
      return false;
    }
  }

  let hostname = parsedUrl.hostname;

  // Special handling for URLs with empty hostnames but paths (like postgres://user:pw@/test)
  if (!hostname && originalUrl.includes('@/') && hasProtocol) {
    // This is likely a database URL with empty hostname but a path
    return !options.require_host;
  }

  // Handle IPv6 addresses
  let isIPv6 = false;
  if (hostname && hostname.startsWith('[') && hostname.endsWith(']')) {
    const ipv6Address = hostname.slice(1, -1);
    if (!isIP(ipv6Address, 6)) {
      return false;
    }
    isIPv6 = true;
    hostname = ipv6Address;
  }

  // Validate host whitelist/blacklist
  if (hostname && options.host_whitelist) {
    return checkHost(hostname, options.host_whitelist);
  }

  if (
    hostname &&
    options.host_blacklist &&
    checkHost(hostname, options.host_blacklist)
  ) {
    return false;
  }

  // Validate host format
  if (hostname && !isIPv6) {
    if (isIP(hostname)) {
      // IPv4 address is valid
    } else {
      // Validate as FQDN
      const fqdnOptions = {
        require_tld: options.require_tld,
        allow_underscores: options.allow_underscores,
        allow_trailing_dot: options.allow_trailing_dot,
      };

      if (!isFQDN(hostname, fqdnOptions)) {
        return false;
      }
    }
  }

  return true;
}
