import assertString from './util/assertString';

/* Regular expression to match the SIP URI structure */
function isValidSipUri(uri) {
  const sipUriRegex = /^sip:([^:@]+(:[^@]*)?@)?((([a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3}|\[[0-9a-fA-F:]+\])(:\d{1,5})?)(;([a-zA-Z0-9-]+=[^;?]+|lr))*?(\?[^#]*)?$/;
  const sipsUriRegex = /^sips:([^:@]+(:[^@]*)?@)?((([a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3}|\[[0-9a-fA-F:]+\])(:\d{1,5})?)(;([a-zA-Z0-9-]+=[^;?]+|lr))*?(\?[^#]*)?$/;

  return sipUriRegex.test(uri) || sipsUriRegex.test(uri);
}

function isValidScheme(schemeAndUser) {
  return (
    schemeAndUser.startsWith('sip:') || schemeAndUser.startsWith('sips:')
  );
}

function isValidPort(domain) {
  const portMatch = domain.match(/:(\d+)($|;)/);
  if (portMatch) {
    const port = parseInt(portMatch[1], 10);
    console.log(port);
    return !isNaN(port) && port > 0 && port <= 65535;
  }
  return true;
}

function isValidParameters(uri) {
  if (uri.includes(';')) {
    const params = uri.split(';').slice(1);
    for (const param of params) {
      /*
        - key is a valid parameter
        - key=value is a valid parameter
        - key=value1;key=value2;... is a valid parameter
      */
      const paramPart = param.split('?')[0];
      if (!/^[a-zA-Z0-9-]+(=[a-zA-Z0-9_.!~*'();&=+$,%-]*)?$/.test(paramPart)) {
        return false;
      }
    }
  }
  return true;
}


/**
 * Function to validate if a string is a valid SIP URI
 * @param {String} str - The SIP URI string
 * @returns {Boolean} - Returns true if valid, otherwise false
 */
export default function isSIP(str) {
  assertString(str);

  // First check the structure using regex
  if (!isValidSipUri(str)) {
    return false;
  }

  // Split the URI into parts (scheme, user, domain)
  const parts = str.split('@');
  const domain = parts.pop();
  const schemeAndUser = parts.join('@');

  // Check for valid scheme (sip or sips)
  if (!isValidScheme(schemeAndUser)) {
    return false;
  }

  // Check if there's a port
  if (!isValidPort(domain)) {
    return false;
  }

  // Validate parameters if present
  if (!isValidParameters(str)) {
    return false;
  }

  return true;
}
