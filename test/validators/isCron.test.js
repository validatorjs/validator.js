import test from '../testFunctions';

describe('isCron', () => {
  const correctsCronExpressions = [
    '0 * * * * *',
    '0 15 * * * *',
    '*/30 * * * * *',
    '0 9 * * 1 *',
    '0 18 * * 5 *',
    '0 2 1 * * *',
    '0 */2 * * 1-5 *',
    '*/15 8-12 * * * *',
    '0 4 */3 * * *',
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
