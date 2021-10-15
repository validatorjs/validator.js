import { test } from './testUtils';

describe('isISSN', () => {
  it('should validate ISSNs', () => {
    test({
      validator: 'isISSN',
      valid: [
        '0378-5955',
        '0000-0000',
        '2434-561X',
        '2434-561x',
        '01896016',
        '20905076',
      ],
      invalid: [
        '0378-5954',
        '0000-0001',
        '0378-123',
        '037-1234',
        '0',
        '2434-561c',
        '1684-5370',
        '19960791',
        '',
      ],
    });
    test({
      validator: 'isISSN',
      args: [{ case_sensitive: true }],
      valid: [
        '2434-561X',
        '2434561X',
        '0378-5955',
        '03785955',
      ],
      invalid: [
        '2434-561x',
        '2434561x',
      ],
    });
    test({
      validator: 'isISSN',
      args: [{ require_hyphen: true }],
      valid: [
        '2434-561X',
        '2434-561x',
        '0378-5955',
      ],
      invalid: [
        '2434561X',
        '2434561x',
        '03785955',
      ],
    });
    test({
      validator: 'isISSN',
      args: [{ case_sensitive: true, require_hyphen: true }],
      valid: [
        '2434-561X',
        '0378-5955',
      ],
      invalid: [
        '2434-561x',
        '2434561X',
        '2434561x',
        '03785955',
      ],
    });
  });
});
