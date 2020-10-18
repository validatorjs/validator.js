import assertString from './util/assertString';

const validPathBySystem = {
  windows: /^[a-zA-Z]:\\(((?![<>:"/\\|?*]).)+((?<![ .])\\)?)*$/,
  unix: /^(\/|\/\/)*([^/\0]+(\/)?)+$/,
};

export default function isPath(str, os) {
  assertString(str);

  const system = os && os.length > 0 && os.toLowerCase();

  if (system && validPathBySystem[system]) {
    return validPathBySystem[system].test(str);
  }
  return false;
}
