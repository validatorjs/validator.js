import test from '../testFunctions';

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

  it('should validate JSON with any value', () => {
    test({
      validator: 'isJSON',
      args: [{ allow_any_value: true }],
      valid: [
        '{ "key": "value" }',
        '{}',
        'null',
        'false',
        'true',
        '"RFC8259"',
        '42',
        '0',
      ],
      invalid: [
        '{ key: "value" }',
        '{ \'key\': \'value\' }',
        '{ "key": value }',
        '01234',
        "'nope'",
      ],
    });
  });
});
