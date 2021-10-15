import { test } from './testUtils';

describe('isBtcAddress', () => {
  it('should validate Bitcoin addresses', () => {
    test({
      validator: 'isBtcAddress',
      valid: [
        '1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL',
        '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        '14qViLJfdGaP4EeHnDyJbEGQysnCpwk3gd',
        '35bSzXvRKLpHsHMrzb82f617cV4Srnt7hS',
        '17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhemt',
        'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
      ],
      invalid: [
        '4J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        '0x56F0B8A998425c53c75C4A303D4eF987533c5597',
        'pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
        '17VZNX1SN5NlKa8UQFxwQbFeFc3iqRYhem',
        'BC1QW508D6QEJXTDG4Y5R3ZARVAYR0C5XW7KV8F3T4',
      ],
    });
  });
});
