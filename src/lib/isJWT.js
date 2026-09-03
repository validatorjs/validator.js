import assertString from './util/assertString';
import isBase64 from './isBase64';

export default function isJWT(str) {
  assertString(str);

  const dotSplit = str.split('.');
  const len = dotSplit.length;

  if (len !== 3) {
    return false;
  }

  if (dotSplit[0] === '' || dotSplit[1] === '') {
    return false;
  }

  return dotSplit.reduce((acc, currElem) => acc && isBase64(currElem, { urlSafe: true }), true);
}
