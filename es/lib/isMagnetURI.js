import assertString from './util/assertString';
var magnetURI = /^magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32,40}&dn=.+&tr=.+$/i;
export default function isMagnetURI(url) {
  assertString(url);
  return magnetURI.test(url.trim());
}