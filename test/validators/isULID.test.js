import test from '../testFunctions';

describe('isULID', () => {
  it('should validate ULIDs', () => {
    test({
      validator: 'isULID',
      valid: [
        '01HBGW8CWQ5Q6DTT7XP89VV4KT',
        '01HBGW8CWR8MZQMBG6FA2QHMDD',
        '01HBGW8CWS3MEEK12Y9G7SVW4V',
        '01hbgw8cws1tq2njavy9amb0wx',
        '01HBGW8cwS43H4jkQ0A4ZRJ7QV',
      ],
      invalid: [
        '',
        '01HBGW-CWS3MEEK1#Y9G7SVW4V',
        '91HBGW8CWS3MEEK12Y9G7SVW4V',
        '81HBGW8CWS3MEEK12Y9G7SVW4V',
        '934859',
        '01HBGW8CWS3MEEK12Y9G7SVW4VXXX',
        '01UBGW8IWS3MOEK12Y9G7SVW4V',
        '01HBGW8CuS43H4JKQ0A4ZRJ7QV',
      ],
    });
  });
});
