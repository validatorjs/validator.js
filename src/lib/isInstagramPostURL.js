import assertString from './util/assertString';
import isURL from './isURL';

const InstagramPostURL = /(https?:\/\/(www\.)?)?instagram\.com(\/p\/\.*)/;

export default function isInstagramPostURL(str) {
  assertString(str);
  return isURL(str) && InstagramPostURL.test(str);
}
