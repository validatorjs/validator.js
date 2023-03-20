/**
 * isUrlResolvable Function
 * This function takes a URL string as input and checks if the URL 
 * is resolvable by performing a DNS lookup on the hostname.
 * @param {string} passed_url - The URL string to be checked
 * @return {boolean} - Returns true if the URL is resolvable, false otherwise
 */
const isUrlResolvable = function (passed_url) {
  // Check if passed url has a protocol
  // If not, add 'http://' by default
  const urlWithProtocol =
    passed_url.startsWith("http://") || passed_url.startsWith("https://")
      ? passed_url
      : `http://${passed_url}`;

  // Parse the URL to extract the hostname
  const parsedUrl = new URL(urlWithProtocol);

  // Check that the hostname is valid
  const hostname = parsedUrl.hostname;
  if (!hostname) {
    return false;
  }

  // Attempt to resolve the hostname using DNS lookup
  return new Promise((resolve) => {
    dns.resolve(hostname, (err, records) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = isUrlResolvable;
