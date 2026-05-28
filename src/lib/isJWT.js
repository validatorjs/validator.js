import assertString from './util/assertString';
import isBase64 from './isBase64';

function getGlobalScope() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  return {};
}

function isBase64EncodedJSON(base64Str) {
  // Convert URL-safe base64 to standard base64
  const standardBase64 = base64Str.replace(/-/g, '+').replace(/_/g, '/');
  try {
    const scope = getGlobalScope();
    const decoded = typeof scope.atob === 'function'
      ? scope.atob(standardBase64)
      : Buffer.from(standardBase64, 'base64').toString('binary');
    try {
      JSON.parse(decoded);
      return true;
    } catch (_err) {
      return false;
    }
  } catch (_err) {
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

  const [header, payload, signature] = dotSplit;

  if (!isBase64(header, { urlSafe: true }) ||
      !isBase64(payload, { urlSafe: true }) ||
      !isBase64(signature, { urlSafe: true })) {
    return false;
  }

  // header and payload must be valid JSON when decoded
  return isBase64EncodedJSON(header) && isBase64EncodedJSON(payload);
}
