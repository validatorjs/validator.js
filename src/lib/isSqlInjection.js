import assertString from './util/assertString';

// Common SQL reserved words match;
const pattern1 = /\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION|LIKE|JOIN|WHERE( +ALL){0,1})\b/gi;

// where 1=1 like match
const pattern2 = /[ \t]+(and|OR|OR|AND)[ \t]+[-\+]?[ \t]*[0-9\.]+[ \t]*[<>=!]{1,2}[ \t]*[-\+]?[ \t]*[0-9\.]+/gi;

export default function isMACAddress(str) {
  assertString(str);
  return pattern1.test(str) || pattern2.test(str);
}
