import assert from 'assert';
import validator from '../../index';
import test from '../testFunctions';

describe('isHexColor', () => {
  it('should validate hexadecimal color strings', () => {
    test({
      validator: 'isHexColor',
      valid: [
        '#ff0000ff',
        '#ff0034',
        '#CCCCCC',
        '0f38',
        'fff',
        '#f00',
      ],
      invalid: [
        '#ff',
        'fff0a',
        '#ff12FG',
        '#######',
        '',
      ],
    });
    test({
      validator: 'isHexColor',
      args: [{ require_hashtag: false }],
      valid: [
        '#ff0000ff',
        '#ff0034',
        '#CCCCCC',
        '0f38',
        'fff',
        '#f00',
      ],
      invalid: [
        '#ff',
        'fff0a',
        '#ff12FG',
        '#######',
        '',
      ],
    });
    test({
      validator: 'isHexColor',
      args: [{ require_hashtag: true }],
      valid: [
        '#ff0000ff',
        '#ff0034',
        '#CCCCCC',
        '#0f38',
        '#fff',
        '#f00',
      ],
      invalid: [
        '#ff',
        'fff0a',
        '#ff12FG',
        '0f38',
        'fff',
        '#######',
        '',
      ],
    });
    test({
      validator: 'isHexColor',
      args: [null],
      valid: ['#fff', '#000000', '123'],
      invalid: ['not-a-color'],
    });
    test({
      validator: 'isHexColor',
      args: [123],
      valid: ['#fff', '#000000', '123', 'abc'],
      invalid: ['gray', 'not-a-color'],
    });
    const validColors = ['#ff0034', '#CCCCCC'].filter(validator.isHexColor);
    assert.strictEqual(validColors.length, 2);
  });
});
