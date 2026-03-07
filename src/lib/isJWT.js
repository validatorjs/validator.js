import assertString from './util/assertString';
import isBase64 from './isBase64';

function tryDecodeJSON(segment) {
  if (!isBase64(segment, { urlSafe: true })) return false;
  try {
    // Normalize base64url alphabet to base64, then restore stripped padding
    let b64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const decoded = Buffer.from(b64, 'base64').toString('utf8');
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
