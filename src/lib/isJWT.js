import assertString from './util/assertString';
import isBase64 from './isBase64';

var getGlobal = function() {
  if (typeof global !== 'undefined') return global;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  return {};
}();

function isBase64EncodedJSON(base64Str) {
  var standardBase64 = base64Str.replace(/-/g, '+').replace(/_/g, '/');
  try {
    var decoded = typeof getGlobal.atob === 'function'
      ? getGlobal.atob(standardBase64)
      : Buffer.from(standardBase64, 'base64').toString('binary');
    try {
      JSON.parse(decoded);
      return true;
    } catch (e2) {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export default function isJWT(str) {
  assertString(str);

  var dotSplit = str.split('.');
  var len = dotSplit.length;

  if (len !== 3) {
    return false;
  }

  var header = dotSplit[0];
  var payload = dotSplit[1];
  var signature = dotSplit[2];

  if (!isBase64(header, { urlSafe: true }) ||
      !isBase64(payload, { urlSafe: true }) ||
      !isBase64(signature, { urlSafe: true })) {
    return false;
  }

  return isBase64EncodedJSON(header) && isBase64EncodedJSON(payload);
}
