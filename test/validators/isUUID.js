import { test } from './testUtils';

describe('isUUID', () => {
  it('should validate UUIDs', () => {
    test({
      validator: 'isUUID',
      valid: [
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
      ],
    });
    test({
      validator: 'isUUID',
      args: [3],
      valid: [
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
      ],
    });
    test({
      validator: 'isUUID',
      args: [4],
      valid: [
        '713ae7e3-cb32-45f9-adcb-7c4fa86b90c1',
        '625e63f3-58f5-40b7-83a1-a72ad31acffb',
        '57b73598-8764-4ad0-a76a-679bb6640eb1',
        '9c858901-8a57-4791-81fe-4c455b099bc9',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
      ],
    });
    test({
      validator: 'isUUID',
      args: [5],
      valid: [
        '987FBC97-4BED-5078-AF07-9141BA07C9F3',
        '987FBC97-4BED-5078-BF07-9141BA07C9F3',
        '987FBC97-4BED-5078-8F07-9141BA07C9F3',
        '987FBC97-4BED-5078-9F07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        '9c858901-8a57-4791-81fe-4c455b099bc9',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
      ],
    });
    test({
      validator: 'isUUID',
      args: [undefined],
      valid: [
        'A117FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A117FBC9-4BED-5078-AF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC94BED3078CF079141BA07C9F3',
        'A11AAAAA-1111-1111-AAAG-111111111111',
      ],
    });
    test({
      validator: 'isUUID',
      args: [null],
      valid: [
        'A127FBC9-4BED-3078-CF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A127FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        '912859',
        'A12AAAAA-1111-1111-AAAG-111111111111',
      ],
    });
    test({
      validator: 'isUUID',
      args: [1],
      valid: [
        'E034B584-7D89-11E9-9669-1AECF481A97B',
      ],
      invalid: [
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'AAAAAAAA-1111-2222-AAAG',
        'AAAAAAAA-1111-2222-AAAG-111111111111',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
      ],
    });
    test({
      validator: 'isUUID',
      args: [2],
      valid: [
        'A987FBC9-4BED-2078-CF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '11111',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
      ],
    });
    test({
      validator: 'isUUID',
      args: [6],
      valid: [],
      invalid: [
        '987FBC97-4BED-1078-AF07-9141BA07C9F3',
        '987FBC97-4BED-2078-AF07-9141BA07C9F3',
        '987FBC97-4BED-3078-AF07-9141BA07C9F3',
        '987FBC97-4BED-4078-AF07-9141BA07C9F3',
        '987FBC97-4BED-5078-AF07-9141BA07C9F3',
      ],
    });
  });
});
