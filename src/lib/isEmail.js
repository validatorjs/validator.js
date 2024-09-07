import assertString from './util/assertString';
import isByteLength from './isByteLength';
import isFQDN from './isFQDN';
import isIP from './isIP';
import merge from './util/merge';

const default_email_options = {
  allow_display_name: false,
  allow_underscores: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true,
  blacklisted_chars: '',
  ignore_max_length: false,
  host_blacklist: [],
  host_whitelist: [],
};

const quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
const quotedEmailUser = /^([\s\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i; // stricter pattern

export default function isEmail(str, options) {
  assertString(str);
  options = merge(options, default_email_options);

  if (options.require_display_name || options.allow_display_name) {
    const display_email = str.match(splitNameAddress);
    if (display_email) {
      let display_name = display_email[1];

      str = str.replace(display_name, '').replace(/(^<|>$)/g, '');

      if (display_name.endsWith(' ')) {
        display_name = display_name.slice(0, -1);
      }

      if (!validateDisplayName(display_name)) {
        return false;
      }
    } else if (options.require_display_name) {
      return false;
    }
  }

  if (!options.ignore_max_length && str.length > defaultMaxEmailLength) {
    return false;
  }

  const parts = str.split('@');
  const domain = parts.pop().toLowerCase();

  if (options.host_blacklist.includes(domain)) {
    return false;
  }

  if (options.host_whitelist.length > 0 && !options.host_whitelist.includes(domain)) {
    return false;
  }

  let user = parts.join('@');

  if (options.domain_specific_validation && (domain === 'gmail.com' || domain === 'googlemail.com')) {
    user = user.toLowerCase();
    const username = user.split('+')[0];
    if (!isByteLength(username.replace(/\./g, ''), { min: 6, max: 30 })) {
      return false;
    }
    const user_parts = username.split('.');
    for (let i = 0; i < user_parts.length; i++) {
      if (!gmailUserPart.test(user_parts[i])) {
        return false;
      }
    }
  }

  if (!isFQDN(domain, { require_tld: options.require_tld })) {
    if (!options.allow_ip_domain || !isIP(domain)) {
      return false;
    }
  }

  if (options.blacklisted_chars && user.search(new RegExp(`[${options.blacklisted_chars}]`, 'g')) !== -1) {
    return false;
  }

  if (user[0] === '"' && user[user.length - 1] === '"') {
    user = user.slice(1, -1);
    return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
  }

  const pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
  const user_parts = user.split('.');
  for (let i = 0; i < user_parts.length; i++) {
    if (!pattern.test(user_parts[i])) {
      return false;
    }
  }

  return true;
}
