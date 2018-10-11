import assertString from './util/assertString';

const jwt = /^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/;

export default function isJWT(str) {
  assertString(str);
  return jwt.test(str);
}
