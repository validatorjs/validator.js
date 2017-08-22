import assertString from './util/assertString';
import isURL from './isURL';

const FacebookPostUrl = /^https:\/\/www\.facebook\.com\/(photo(\.php|s)|permalink\.php|media|questions|notes|[^\/]+\/(activity|posts|photos|videos))[\/?].*\//gm;

export default function isFacebookPostURL(str) {
  assertString(str);
  return isURL(str) && FacebookPostUrl.test(str);
}
