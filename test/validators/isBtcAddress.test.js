import test from '../testFunctions';

describe('isBtcAddress', () => {
  it('should validate Bitcoin addresses', () => {
    test({
      validator: 'isBtcAddress',
      valid: [
        '1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL',
        'mucFNhKMYoBQYUAEsrFVscQ1YaFQPekBpg',
        '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        '2NFUBBRcTJbYc1D4HSCbJhKZp6YCV4PQFpQ',
        'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        '14qViLJfdGaP4EeHnDyJbEGQysnCpwk3gd',
        '35bSzXvRKLpHsHMrzb82f617cV4Srnt7hS',
        '17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhemt',
        'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
        'tb1qxhkl607frtvjsy9nlyeg03lf6fsq947pl2pe82',
        'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297',
        'tb1pzpelffrdh9ptpaqnurwx30dlewqv57rcxfeetp86hsssk30p4cws38tr9y',
      ],
      invalid: [
        '3J98t1WpEZ73CNmQviecrnyiWrnqh0WNL0',
        '3J98t1WpEZ73CNmQviecrnyiWrnqh0WNLo',
        '3J98t1WpEZ73CNmQviecrnyiWrnqh0WNLI',
        '3J98t1WpEZ73CNmQviecrnyiWrnqh0WNLl',
        '4J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        '0x56F0B8A998425c53c75C4A303D4eF987533c5597',
        'pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
        '17VZNX1SN5NlKa8UQFxwQbFeFc3iqRYhem',
        'BC1QW508D6QEJXTDG4Y5R3ZARVAYR0C5XW7KV8F3T4',
        'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3291',
        'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg329b',
        'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg329i',
        'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg329o',
        'BC1P5D7RJQ7G6RDK2YHZKS9SMLAQTEDR4DEKQ08GE8ZTWAC72SFR9RUSXG3297',
        'TB1PZPELFFRDH9PTPAQNURWX30DLEWQV57RCXFEETP86HSSSK30P4CWS38TR9Y',
      ],
    });
  });
});
