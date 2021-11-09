import assertString from './util/assertString';
import merge from './util/merge';

const lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/;

const latDMS = /^(([1-8]?\d)\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|90\D+0\D+0)\D+[NSns]?$/i;

const defaultLatLongOptions = {
  checkDMS: false,
};

export default function isLat(str, options) {
  assertString(str);
  options = merge(options, defaultLatLongOptions);

  return options.checkDMS ? latDMS.test(str) : lat.test(str);
}
