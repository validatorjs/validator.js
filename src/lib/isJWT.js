import assertString from './util/assertString';
import isBase64 from './isBase64';

function isValidJSONObject(str) {
  // Base64 URL decode
  // Replace URL-safe chars and add padding if needed
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }

  try {
    // Use atob for browser or Buffer for Node.js
    let decoded;
    if (typeof atob === 'function') {
      decoded = atob(base64);
    } else if (typeof Buffer !== 'undefined') {
      decoded = Buffer.from(base64, 'base64').toString('utf8');
    } else {
      return false;
    }

    // Parse as JSON and verify it's an object (not array, string, number, etc.)
    const parsed = JSON.parse(decoded);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
  } catch (e) {
    return false;
  }
}

export default function isJWT(str) {
  assertString(str);

  const dotSplit = str.split('.');
  const len = dotSplit.length;

  if (len !== 3) {
    return false;
  }

  // All three parts must be valid Base64 URL
  const allBase64 = dotSplit.reduce(
    (acc, currElem) => acc && isBase64(currElem, { urlSafe: true }),
    true
  );

  if (!allBase64) {
    return false;
  }

  // Header (first part) and Payload (second part) must be valid JSON objects
  // Signature (third part) does not need to be valid JSON
  return isValidJSONObject(dotSplit[0]) && isValidJSONObject(dotSplit[1]);
}
