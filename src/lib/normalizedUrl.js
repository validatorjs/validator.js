import { URL } from 'url';

export default function normalizeUrl(inputURL, options) {
  try {
    const parsedURL = new URL(inputURL);
    // Validate the input URL
    if (!parsedURL.host) {
      throw new Error('Invalid URL. URL must include a valid hostname.');
    }

    // Check if the URL contains a protocol
    const hasProtocol = !!parsedURL.protocol;

    // Apply the default protocol if needed
    if (!hasProtocol && options.defaultProtocol) {
      parsedURL.protocol = options.defaultProtocol;
    }

    // Validate the protocol
    if (parsedURL.protocol && !['http:', 'https:'].includes(parsedURL.protocol)) {
      throw new Error('Invalid protocol. Only "http://" and "https://" protocols are allowed.');
    }

    // Force the URL to use "http://" if required
    if (options.requireHttp) {
      parsedURL.protocol = 'http:';
    }

    // Force the URL to use "https://" if required
    if (options.requireHttps) {
      parsedURL.protocol = 'https:';
    }

    // Remove username and password if required
    if (options.removeAuth) {
      parsedURL.username = '';
      parsedURL.password = '';
    }

    // Remove "www" subdomain if required
    if (options.removeWWW && parsedURL.hostname.startsWith('www.')) {
      parsedURL.hostname = parsedURL.hostname.replace(/^www\./i, '');
    }

    // Remove hash fragment if required
    if (options.removeHash) {
      parsedURL.hash = '';
    }

    // Remove query string if required
    if (options.removeQuery) {
      parsedURL.search = '';
    }

    // Remove directory index strings from the end of the URL if required
    if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
      const pathname = parsedURL.pathname;
      for (const indexString of options.removeDirectoryIndex) {
        if (pathname.endsWith(indexString)) {
          parsedURL.pathname = pathname.slice(0, -indexString.length);
          break;
        }
      }
    }

    // Sort query parameters if required
    if (options.sortQueryParameters && parsedURL.search) {
      const queryParameters = new URLSearchParams(parsedURL.search);
      const sortedQueryParams = Array.from(queryParameters.entries()).sort();
      const sortedSearchParams = new URLSearchParams(sortedQueryParams);
      parsedURL.search = `?${sortedSearchParams.toString()}`;
    }

    // removePort
    if (options.removePort && parsedURL.port) {
      parsedURL.port = '';
    }

    if (options.removeTrailingSlash && parsedURL.pathname.endsWith('/')) {
      parsedURL.pathname = parsedURL.pathname.slice(0, -1);
    }

    // Reconstruct the normalized URL
    let normalizedURL = parsedURL.href;

    // Remove end slash if required
    if (options.removeEndSlash && normalizedURL.endsWith('/')) {
      normalizedURL = normalizedURL.slice(0, -1);
    }

    // Ensure the URL is well-formed and not missing any required parts
    const wellFormedURL = new URL(normalizedURL);

    // Validate the hostname
    if (!wellFormedURL.hostname || wellFormedURL.hostname === '') {
      throw new Error('Invalid URL. Hostname must be provided.');
    }

    // Validate the path
    if (wellFormedURL.pathname === '') {
      throw new Error('Invalid URL. Path cannot be empty.');
    }

    // Validate the query parameters
    if (wellFormedURL.search && !wellFormedURL.search.startsWith('?')) {
      throw new Error('Invalid URL. Query parameters should not include "?" symbol.');
    }

    if (normalizedURL.includes('/?')) {
      normalizedURL = normalizedURL.replace(/\/\?/g, '?');
    }

    return normalizedURL;
  } catch (error) {
    // Gracefully handle errors
    console.error('URL normalization error:', error.message);
    return inputURL; // Return the original input URL on error
  }
}

