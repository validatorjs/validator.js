import assertString from './util/assertString';
var jwt = /^([A-Za-z0-9\-_~+\/]+[=]{0,2})\.([A-Za-z0-9\-_~+\/]+[=]{0,2})(?:\.([A-Za-z0-9\-_~+\/]+[=]{0,2}))?$/;
export default function isJWT(str) {
  assertString(str);
  return jwt.test(str);
}