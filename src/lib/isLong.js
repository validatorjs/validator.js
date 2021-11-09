import assertString from './util/assertString';
import merge from './util/merge';

const long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/;
const longDMS = /^\s*([1-7]?\d{1,2}\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|180\D+0\D+0)\D+[EWew]?$/i;

const defaultLatLongOptions = {
  checkDMS: false,
};

export default function isLong(str, options) {
  assertString(str);
  options = merge(options, defaultLatLongOptions);

  return options.checkDMS ? longDMS.test(str) : long.test(str);
}
