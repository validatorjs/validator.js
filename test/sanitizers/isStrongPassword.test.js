import test from '../testFunctions';

describe('isStrongPassword', () => {
  it('should score passwords', () => {
    test({
      sanitizer: 'isStrongPassword',
      args: [{
        returnScore: true,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      }],
      expect: {
        abc: 13,
        abcc: 13.5,
        aBc: 23,
        'Abc123!': 47,
        '!@#$%^&*()': 20,
      },
    });
  });

  it('should score passwords with default options', () => {
    test({
      sanitizer: 'isStrongPassword',
      expect: {
        abc: false,
        abcc: false,
        aBc: false,
        'Abc123!': false,
        '!@#$%^&*()': false,
        'abc123!@f#rA': true,
      },
    });
  });
});
