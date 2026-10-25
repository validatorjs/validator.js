// Build and test tooling: CommonJS scripts run directly by Node.js.
module.exports = {
  parserOptions: {
    sourceType: 'script',
  },
  rules: {
    strict: ['error', 'global'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
  overrides: [
    {
      // ES module scripts (.mjs) run directly by Node.js.
      files: ['*.mjs'],
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        strict: 'off',
      },
    },
  ],
};
