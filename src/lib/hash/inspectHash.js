import assertString from '../util/assertString';
import hashProperties from './hashProperties';
import isHash from './isHash';
import InspectionResult from '../util/inspectionResult';

export default function inspectHash(str) {
  assertString(str);

  const strLength = str.length;

  const inspectionResult = new InspectionResult({
    algorithms: [],
    lenght: strLength,
  });

  const algorithmsFinal = hashProperties.algorithms.filter(algorithm => algorithm.hashLength === strLength);

  if (algorithmsFinal.length === 0) {
    return inspectionResult;
  }

  for (const algorithm of algorithmsFinal) {
    if (isHash(str, algorithm.name, true)) {
      inspectionResult.isValid = true;
      inspectionResult.properties.algorithms.push(algorithm.name);
    }
  }

  return inspectionResult;
}
