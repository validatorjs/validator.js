/*
 * Shared checks for the smoke pages served by test/browser/run.mjs. The pages
 * report through `window.validatorTestResult`, which run.mjs reads.
 */

export function check(condition, message) {
  if (!condition) throw new Error(message);
}

// Compares a loaded validator object with the CommonJS build: the same export
// names, the same version, and the same results for the run.mjs SAMPLES.
export function checkValidator(validator, expected) {
  check(validator && typeof validator === 'object', `expected the validator object, got ${typeof validator}`);
  const keys = Object.keys(validator).filter(key => key !== 'default').sort();
  const missing = expected.keys.filter(key => keys.indexOf(key) === -1);
  const extra = keys.filter(key => expected.keys.indexOf(key) === -1);
  check(!missing.length && !extra.length, `exports differ from the CommonJS build: missing [${missing}], extra [${extra}]`);
  check(validator.version === expected.version, `version ${validator.version}, expected ${expected.version}`);
  const wrong = expected.samples
    .filter(([name, args, result]) => !Object.is(validator[name](...args), result))
    .map(([name, args, result]) => `${name}(${JSON.stringify(args).slice(1, -1)}) !== ${JSON.stringify(result)}`);
  check(!wrong.length, `wrong results: ${wrong.join('; ')}`);
  return `${keys.length} exports, ${expected.samples.length} sample calls`;
}

export function runSmoke(test) {
  const report = (result) => {
    window.validatorTestResult = Object.assign({ done: true }, result);
  };
  fetch('/build/expected.json')
    .then(response => response.json())
    .then(test)
    .then(
      details => report({ ok: true, details }),
      error => report({ ok: false, error: String((error && error.stack) || error) })
    );
}

// Promise wrapper for the AMD require() of RequireJS.
export function amdRequire(ids) {
  return new Promise((resolve, reject) => {
    window.require(ids, (...modules) => resolve(modules), reject);
  });
}
