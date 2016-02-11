import assertString from '../util/assertString';

const base64 = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;

export default function isBase64(str) {
  assertString(str);
  return base64.test(str);
}
