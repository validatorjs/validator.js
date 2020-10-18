import assertString from './util/assertString';

const validPathBySystem = {
  windows: /^[a-zA-Z]:\\(((?![<>:"/\\|?*]).)+((?<![ .])\\)?)*$/,
  unix: /^(\/|\/\/)*([^/\0]+(\/)?)+$/,
};

export default function isPath(str, os) {
  assertString(str);
  assertString(os);

  const system = os.toLowerCase();

  return (system in validPathBySystem) && validPathBySystem[system].test(str);
}
