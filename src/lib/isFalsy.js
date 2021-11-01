import isTruthy from './isTruthy';

export default function isFalsy(value) {
  return !isTruthy(value);
}
