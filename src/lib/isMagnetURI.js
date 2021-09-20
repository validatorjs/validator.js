import assertString from './util/assertString';

const magnetURI = /^magnet:\?xt(?:\.1)?=urn:(?:aich|bitprint|btih|ed2k|ed2khash|kzhash|md5|sha1|tree:tiger):[a-z0-9]{32}(?:[a-z0-9]{8})?($|&)/i;

export default function isMagnetURI(url) {
  assertString(url);
  return magnetURI.test(url.trim());
}
