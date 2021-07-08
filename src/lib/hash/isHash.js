import assertString from '../util/assertString';
import hashProperties from './hashProperties';

export default function isHash(str, algorithmName, assertStringOk = false) {
  if (!algorithmName) {
    throw new Error('Required parameter algorithmName not provided.');
  }

  if (!assertStringOk) {
    assertString(str);
  }

  const algorithmMetadata = hashProperties.algorithms.find(algorithm => algorithm.name === algorithmName);

  if (algorithmMetadata === undefined) {
    throw new Error(`A test for the algorithm ${algorithmName} is not supported.`);
  }

  const hash = new RegExp(`^[a-fA-F0-9]{${algorithmMetadata.hashLength}}$`);
  return hash.test(str);
}
