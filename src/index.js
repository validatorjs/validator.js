// eslint-disable-next-line import/extensions
import validators from './lib/index.js';
import Validator from './lib/builder';

const version = '13.6.0';

const validator = {
  version,
  ...validators,
  Validator,
};

export default validator;
