import assertString from './util/assertString';
import isEmail from './isEmail';

function getAtSignIndices(str) {
  let indices = [];
  for (let i = 1; i < str.length - 1; i++) {
    // @ in the beginning or end can't make a valid email address.
    // two @ next to each other can't make a valid email address.
    if (str[i] === '@' && str[i + 1] !== '@' && str[i - 1] !== '@') {
      indices.push(i);
    }
  }
  return indices;
}

function checkAtSignLeftSide(atSignIndex, str) {
  for (let i = atSignIndex - 1; i >= 0; i--) {
    if (isEmail(`${str.substring(i, atSignIndex)}@valid.com`)) {
      return true;
    }
  }
  return false;
}

function checkAtSignRightSide(atSignIndex, str) {
  for (let i = atSignIndex + 2; i <= str.length; i++) {
    if (isEmail(`valid@${str.substring(atSignIndex + 1, i)}`)) {
      return true;
    }
    if (i >= str.length || str.charAt(i) === '@') {
      break;
    }
  }
  return false;
}

export default function containsEmail(str) {
  assertString(str);
  if (!str.includes('@')) {
    return false;
  }

  let atSignIndices = getAtSignIndices(str);
  for (const atSignIndex of atSignIndices) {
    let isLeftSideValid = checkAtSignLeftSide(atSignIndex, str);
    let isRightSideValid = checkAtSignRightSide(atSignIndex, str);
    if (isLeftSideValid && isRightSideValid) {
      return true;
    }
  }

  return false;
}
