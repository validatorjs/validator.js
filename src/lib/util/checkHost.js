function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}

export default function checkHost(host, matches) {
  for (let i = 0; i < matches.length; i++) {
    let match = matches[i];
    if (host === match || (isRegExp(match) && match.test(host))) {
      return true;
    }
  }
  return false;
}
