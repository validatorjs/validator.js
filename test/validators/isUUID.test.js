import test from '../testFunctions';

describe('isUUID', () => {
  it('should validate UUIDs', () => {
    test({
      validator: 'isUUID',
      valid: [
        '9deb20fe-a6e0-355c-81ea-288b009e4f6d',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-6078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
        'A987FBC9-4BED-8078-AF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
      ],
    });
    test({
      validator: 'isUUID',
      args: [undefined],
      valid: [
        '9deb20fe-a6e0-355c-81ea-288b009e4f6d',
        'A117FBC9-4BED-5078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
      invalid: [
        '',
        'A117FBC9-4BED-3078-CF07-9141BA07C9F3',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC94BED3078CF079141BA07C9F3',
        'A11AAAAA-1111-1111-AAAG-111111111111',
      ],
    });
    test({
      validator: 'isUUID',
      args: [null],
      valid: [
        'A127FBC9-4BED-3078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A127FBC9-4BED-3078-CF07-9141BA07C9F3',
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
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
    });
    test({
      validator: 'isUUID',
      args: [2],
      valid: [
        'A987FBC9-4BED-2078-AF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '11111',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-2078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
    });
    test({
      validator: 'isUUID',
      args: [3],
      valid: [
        '9deb20fe-a6e0-355c-81ea-288b009e4f6d',
      ],
      invalid: [
        '',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
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
        '018C544A-D384-7000-BB74-3B1738ABE43C',
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
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
    });
    test({
      validator: 'isUUID',
      args: [6],
      valid: [
        '1ef29908-cde1-69d0-be16-bfc8518a95f0',
      ],
      invalid: [
        '987FBC97-4BED-1078-AF07-9141BA07C9F3',
        '987FBC97-4BED-2078-AF07-9141BA07C9F3',
        '987FBC97-4BED-3078-AF07-9141BA07C9F3',
        '987FBC97-4BED-4078-AF07-9141BA07C9F3',
        '987FBC97-4BED-5078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
        '987FBC97-4BED-8078-AF07-9141BA07C9F3',
      ],
    });
    test({
      validator: 'isUUID',
      args: [7],
      valid: [
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-6078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-8078-AF07-9141BA07C9F3',
        '713ae7e3-cb32-45f9-adcb-7c4fa86b90c1',
        '625e63f3-58f5-40b7-83a1-a72ad31acffb',
        '57b73598-8764-4ad0-a76a-679bb6640eb1',
        '9c858901-8a57-4791-81fe-4c455b099bc9',
      ],
    });
    test({
      validator: 'isUUID',
      args: [8],
      valid: [
        '018C544A-D384-8000-BB74-3B1738ABE43C',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-6078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-7078-AF07-9141BA07C9F3',
        '713ae7e3-cb32-45f9-adcb-7c4fa86b90c1',
        '625e63f3-58f5-40b7-83a1-a72ad31acffb',
        '57b73598-8764-4ad0-a76a-679bb6640eb1',
        '9c858901-8a57-4791-81fe-4c455b099bc9',
      ],
    });
    test({
      validator: 'isUUID',
      args: ['nil'],
      valid: [
        '00000000-0000-0000-0000-000000000000',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        '9deb20fe-a6e0-355c-81ea-288b009e4f6d',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-6078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
        'A987FBC9-4BED-8078-AF07-9141BA07C9F3',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF',
      ],
    });
    test({
      validator: 'isUUID',
      args: ['max'],
      valid: [
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        '9deb20fe-a6e0-355c-81ea-288b009e4f6d',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-6078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
        'A987FBC9-4BED-8078-AF07-9141BA07C9F3',
        '00000000-0000-0000-0000-000000000000',
      ],
    });
    test({
      validator: 'isUUID',
      args: ['loose'],
      valid: [
        '9deb20fe-a6e0-355c-81ea-288b009e4f6d',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-6078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
        'A987FBC9-4BED-8078-AF07-9141BA07C9F3',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA',
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        'EEEEEEEE-EEEE-EEEE-EEEE-EEEEEEEEEEEE',
        '99999999-9999-9999-9999-999999999999',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
      ],
    });
    test({
      validator: 'isUUID',
      args: ['all'],
      valid: [
        '9deb20fe-a6e0-355c-81ea-288b009e4f6d',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-6078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
        'A987FBC9-4BED-8078-AF07-9141BA07C9F3',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
      ],
    });
    test({
      validator: 'isUUID',
      args: ['invalid'],
      valid: [],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        '9deb20fe-a6e0-355c-81ea-288b009e4f6d',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-6078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
        'A987FBC9-4BED-8078-AF07-9141BA07C9F3',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF',
      ],
    });
  });
});
