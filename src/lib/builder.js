// eslint-disable-next-line import/extensions
import _ from './index.js';

class Validator {
  constructor(value) {
    this.value = value;
    this.error = { valid: true, errors: [] };
  }
  toDate() {
    this.value = _.toDate(this.value);
    return this;
  }
  toFloat() {
    this.value = _.toFloat(this.value);
    return this;
  }
  toInt() {
    this.value = _.toInt(this.value);
    return this;
  }
  toBoolean() {
    this.value = _.toBoolean(this.value);
    return this;
  }
  equals(comparison) {
    if (!_.equals(this.value, comparison)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not Equal' }] };
    }
    return this;
  }
  contains(elem, options) {
    if (!_.contains(this.value, elem, options)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value does not contain the seed' }] };
    }
    return this;
  }
  matches(pattern, modifiers) {
    if (!_.isEmpty(this.value, pattern, modifiers)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value does not match the pattern' }] };
    }
    return this;
  }
  isEmail() {
    if (!_.isEmail(this.value)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not an Email' }] };
    }
    return this;
  }
  isURL() {
    if (!_.isURL(this.value)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not an URL' }] };
    }
    return this;
  }
  isMACAddress() {
    if (!_.isMACAddress(this.value)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not a MAC Address' }] };
    }
    return this;
  }
  isIP() {
    if (!_.isIP(this.value)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not an IP' }] };
    }
    return this;
  }
  isIPRange(version) {
    if (!_.isIPRange(this.value, version)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not an IP Range' }] };
    }
    return this;
  }
  isFQDN(options) {
    if (!_.isFQDN(this.value, options)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not a FQDN' }] };
    }
    return this;
  }
  isBoolean() {
    if (!_.isBoolean(this.value)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not a Boolean' }] };
    }
    return this;
  }
  isIBAN() {
    if (!_.isIBAN(this.value)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not an IBAN' }] };
    }
    return this;
  }
  isBIC() {
    if (!_.isBIC(this.value)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not a BIC' }] };
    }
    return this;
  }
  isAlpha() {
    if (!_.isAlpha(this.value)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not a Alpha' }] };
    }
    return this;
  }
  // Methods to be added
  validate() {
    return this.error;
  }
}

export default Validator;
