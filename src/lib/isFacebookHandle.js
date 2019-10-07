import assertString from './util/assertString';

const facebookHandlePattern = /^([a-zA-Z0-9\.]{5,})$/;
const consecutiveDotsPattern = /([\.]{2,})/;
const invalidHighLevelDomainPattern = /(\.com|\.net)$/;

// Using Facebook's username guidelines from https://www.facebook.com/help/409473442437047
export default function isFacebookHandle(str) {
  assertString(str);
  return facebookHandlePattern.test(str) &&
    !consecutiveDotsPattern.test(str) &&
    !invalidHighLevelDomainPattern.test(str);
}
