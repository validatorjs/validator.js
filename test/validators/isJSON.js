import { test } from './testUtils';

describe('isJSON', () => {
  it('should validate JSON', () => {
    test({
      validator: 'isJSON',
      valid: [
        '{ "key": "value" }',
        '{}',
      ],
      invalid: [
        '{ key: "value" }',
        '{ \'key\': \'value\' }',
        'null',
        '1234',
        '"nope"',
      ],
    });
  });

  it('should validate JSON with primitives', () => {
    test({
      validator: 'isJSON',
      args: [{ allow_primitives: true }],
      valid: [
        '{ "key": "value" }',
        '{}',
        'null',
        'false',
        'true',
      ],
      invalid: [
        '{ key: "value" }',
        '{ \'key\': \'value\' }',
        '{ "key": value }',
        '1234',
        '"nope"',
      ],
    });
  });
});
