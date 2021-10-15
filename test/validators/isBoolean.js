import { test } from './testUtils';

describe('isBoolean', () => {
  it('should validate booleans', () => {
    test({
      validator: 'isBoolean',
      valid: [
        'true',
        'false',
        '0',
        '1',
      ],
      invalid: [
        '1.0',
        '0.0',
        'true ',
        'False',
        'True',
        'yes',
      ],
    });
  });

  it('should validate booleans with option loose set to true', () => {
    test({
      validator: 'isBoolean',
      args: [
        { loose: true },
      ],
      valid: [
        'true',
        'True',
        'TRUE',
        'false',
        'False',
        'FALSE',
        '0',
        '1',
        'yes',
        'Yes',
        'YES',
        'no',
        'No',
        'NO',
      ],
      invalid: [
        '1.0',
        '0.0',
        'true ',
        ' false',
      ],
    });
  });
});
