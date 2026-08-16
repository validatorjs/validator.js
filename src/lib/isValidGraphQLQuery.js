import assertString from './util/assertString';

let isGraphQLAvailable = false;
let parseFunction = null;

// Attempt to load GraphQL parse function
/* istanbul ignore if */
if (typeof process === 'undefined' || !process.versions || !process.versions.node) {
  // Skip initialization in non-Node environments
} else {
  const nodeVersion = process.versions.node.split('.')[0];
  /* istanbul ignore else */
  if (parseInt(nodeVersion, 10) >= 10) {
    try {
      // eslint-disable-next-line global-require
      const { parse } = require('graphql');
      parseFunction = parse;
      isGraphQLAvailable = true;
    } catch (e) {
      /* istanbul ignore next */
      // GraphQL loading failed
      isGraphQLAvailable = false;
    }
  }
}

export default function isValidGraphQLQuery(input) {
  assertString(input);

  /* istanbul ignore if */
  if (!isGraphQLAvailable || !parseFunction) {
    /* istanbul ignore next */
    return false;
  }

  try {
    const obj = parseFunction(input);
    return (!!obj && typeof obj === 'object');
  } catch (e) {
    return false;
  }
}
