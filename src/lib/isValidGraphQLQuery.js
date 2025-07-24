import assertString from './util/assertString';

let isGraphQLAvailable = false;
let parseFunction = null;

// Attempt to load GraphQL parse function
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  const nodeVersion = process.versions.node.split('.')[0];
  if (parseInt(nodeVersion, 10) >= 10) {
    try {
      // eslint-disable-next-line global-require
      const { parse } = require('graphql');
      parseFunction = parse;
      isGraphQLAvailable = true;
    } catch (e) {
      // GraphQL loading failed
    }
  }
}

export default function isValidGraphQLQuery(input) {
  assertString(input);

  if (!isGraphQLAvailable || !parseFunction) {
    return false;
  }

  try {
    const obj = parseFunction(input);
    return (!!obj && typeof obj === 'object');
  } catch (e) {
    return false;
  }
}
