import { parse } from 'graphql';
import assertString from './util/assertString';

export default function isValidGraphQLQuery(input) {
  assertString(input);
  try {
    const obj = parse(input);
    return (!!obj && typeof obj === 'object');
  } catch (e) {
    return false;
  }
}
