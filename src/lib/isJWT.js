import assertString from './util/assertString';
import isBase64 from './isBase64';

function decodeBase64Url(b64) {
  if (typeof Buffer !== 'undefined') {
    if (typeof Buffer.from === 'function') {
      return Buffer.from(b64, 'base64').toString('utf8');
    }
    // eslint-disable-next-line no-buffer-constructor
    return new Buffer(b64, 'base64').toString('utf8');
  }
  if (typeof atob === 'function') {
    const binary = atob(b64);
    if (typeof TextDecoder !== 'undefined') {
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    }
    let encoded = '';
    for (let i = 0; i < binary.length; i += 1) {
      const code = binary.charCodeAt(i).toString(16).padStart(2, '0');
      encoded += `%${code}`;
    }
    return decodeURIComponent(encoded);
  }
  return b64;
}

function tryDecodeJSON(segment) {
  if (!isBase64(segment, { urlSafe: true })) return false;
  try {
    // Normalize base64url alphabet to base64, then restore stripped padding
    let b64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const decoded = decodeBase64Url(b64);
    const parsed = JSON.parse(decoded);
    if (typeof parsed !== 'object') return false;
    if (parsed === null) return false;
    if (Array.isArray(parsed)) return false;
    return true;
  } catch (e) {
    return false;
  }
}

export default function isJWT(str) {
  assertString(str);

  const dotSplit = str.split('.');

  if (dotSplit.length !== 3) return false;

  const header = dotSplit[0];
  const payload = dotSplit[1];
  const signature = dotSplit[2];

  if (!tryDecodeJSON(header)) return false;
  if (!tryDecodeJSON(payload)) return false;
  if (!isBase64(signature, { urlSafe: true })) return false;

  return true;
}
