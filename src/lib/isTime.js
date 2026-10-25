import merge from './util/merge';

const default_time_options = {
  hourFormat: 'hour24',
  mode: 'default',
};

const formats = {
  hour24: {
    default: /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/,
    withSeconds: /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
    withOptionalSeconds: /^([01]?[0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9]))?$/,
  },
  hour12: {
    default: /^(0?[1-9]|1[0-2]):([0-5][0-9]) (A|P)M$/,
    withSeconds: /^(0?[1-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) (A|P)M$/,
    withOptionalSeconds: /^(0?[1-9]|1[0-2]):([0-5][0-9])(?::([0-5][0-9]))? (A|P)M$/,
  },
};

export default function isTime(input, options) {
  options = merge(options, default_time_options);
  // TODO(next major): throw on non-string input like the other validators (assertString).
  // Returning false is the current, documented behaviour (README, "Strings only").
  if (typeof input !== 'string') return false;
  return formats[options.hourFormat][options.mode].test(input);
}
