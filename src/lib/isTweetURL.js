import assertString from './util/assertString';
import isURL from './isURL';

const TweetURL = /(https?:\/\/(wwww\.)?)?twitter\.com(\/\.*)(.*)/;

export default function isTweetURL(str) {
  assertString(str);
  return isURL(str) && TweetURL.test(str);
}

