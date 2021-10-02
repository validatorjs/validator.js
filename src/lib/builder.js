import equals from './equals';
import isEmpty from './isEmpty';

class Validator {
  constructor(value) {
    this.value = value;
    this.error = { valid: true, errors: [] };
  }
  equals(comparison) {
    if (equals(this.value, comparison)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: `value isn\'t equal to ${comparison} ` }] };
    }
    return this;
  }
  isEmpty() {
    if (!isEmpty(this.value)) {
      this.error = { valid: false, errors: [...this.error.errors, { value: 'value is not Empty' }] };
    }
    return this;
  }
  //  The other methods need to be added
  validate() {
    return this.error;
  }
}

export default Validator;
