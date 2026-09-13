import assertString from './util/assertString';

const mongoId = /^[0-9a-f]{24}$/i;

export default function isMongoId(str) {
  assertString(str);
  return mongoId.test(str);
}
