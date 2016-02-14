import isEmail from './isEmail';
import merge from './util/merge';

const default_normalize_email_options = {
  lowercase: true,
  remove_dots: true,
  remove_extension: true,
};

export default function normalizeEmail(email, options) {
  options = merge(options, default_normalize_email_options);
  if (!isEmail(email)) {
    return false;
  }
  const parts = email.split('@', 2);
  parts[1] = parts[1].toLowerCase();
  if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
    if (options.remove_extension) {
      parts[0] = parts[0].split('+')[0];
    }
    if (options.remove_dots) {
      parts[0] = parts[0].replace(/\./g, '');
    }
    if (!parts[0].length) {
      return false;
    }
    parts[0] = parts[0].toLowerCase();
    parts[1] = 'gmail.com';
  } else if (options.lowercase) {
    parts[0] = parts[0].toLowerCase();
  }
  return parts.join('@');
}
