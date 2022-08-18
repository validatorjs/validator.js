import assertString from './util/assertString';
import isBase64 from './isBase64';

export default function isJWT(str, jwe = false) {
  assertString(str);

  const dotSplit = str.split('.');
  const len = dotSplit.length;

  /*eslint no-lonely-if: "error"*/
  if (!jwe) {
    if (len > 3 || len < 2) {
      return false;
    }
  } else {
    if (len < 5 || len > 5) {
      return false;
    }
  }

  return dotSplit.reduce((acc, currElem) => acc && isBase64(currElem, { urlSafe: true }), true);
}
