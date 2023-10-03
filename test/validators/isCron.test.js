import test from '../testFunctions';

describe('isCron', () => {
  const correctsCronExpressions = [
    '* * * * * *',
    '*/10 * * * * *',
    '* */10 * * * *',
    '* * */10 * * *',
    '* * * */10 * *',
    '* * * * */10 *',
    '* * * * * */6',
    '10,12 * * * * *',
    '* 10,12 * * * *',
    '* * 10,12 * * *',
    '* * * 10,12 * *',
    '* * * * 10,12 *',
    '* * * * * 2,6',
    '10-12 * * * * *',
    '* 10-12 * * * *',
    '* * 10-12 * * *',
    '* * * 10-12 * *',
    '* * * * 10-12 *',
    '* * * * * 2-6',
    '* * * ? * *',
    '* * * * * ?',
    '* * * L * *',
    '* * * LW * *',
    '* * * W * *',
    '* * * 4W * *',
    '* * * * * L',
    '* * * * * 3#4',
  ];
  const incorrectsCronExpressions = [
    '60 * * * *',
    '0 24 * * *',
    '0 * * 13 *',
    '0 * * * 0',
    '0 * * * MON-FRI',
    '0 1/0 * * *',
    '0 * * *',
    '0 * * * * * *',
    '*/75 * * * *',
  ];
  it('should validate cron expressions', () => {
    test({
      validator: 'isCron',
      args: [...correctsCronExpressions, ...incorrectsCronExpressions],
      valid: [...correctsCronExpressions],
      invalid: [...incorrectsCronExpressions],
    });
  });
});
