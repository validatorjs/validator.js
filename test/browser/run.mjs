/*
 * Runs validator's browser builds in real browsers (Chromium, Firefox and
 * WebKit, through Playwright):
 *
 *  1. The Mocha test suite (test/**\/*.js, minus the Node.js-only parts listed
 *     in EXCLUDED_FILES and EXCLUDED_TESTS) against the built UMD bundles
 *     validator.min.js and validator.js, loaded with a plain <script> tag. The
 *     test files are bundled with Rollup; their imports of the library
 *     (`../src/index`, `../index`, `../../src`, `../src/lib/<name>`) resolve to
 *     the `validator` global defined by the bundle, so src/ is never used.
 *  2. Smoke pages for the loading methods documented in README.md:
 *     global.html     <script src="validator(.min).js"> defines `validator`
 *     amd.html        RequireJS loads the bundle as an AMD module, no global
 *     es-modules.html <script type="module"> imports es/index.js and
 *                     es/lib/*.js directly, without a bundler
 *
 * It needs a build (`npm run build`), the development dependencies, and two
 * packages that are not development dependencies because they need a recent
 * Node.js (the main CI matrix installs the development dependencies on
 * Node.js 8+). The versions CI uses are pinned in .github/workflows/ci.yml:
 *
 *   npm install --no-save playwright@<version> requirejs@<version>
 *   npx playwright install --with-deps chromium firefox webkit
 *   npm run test:browser
 *
 * Both are loaded with require(), so they can also live outside the project,
 * for example: NODE_PATH=/tmp/tools/node_modules npm run test:browser
 *
 * Options:
 *   --browser=<names>  comma-separated subset of chromium,firefox,webkit
 *   --serve            only start the local server and print the page URLs,
 *                      to debug the pages in a browser of your choice
 *
 * Everything is served from a local server on 127.0.0.1; the pages make no
 * other network requests.
 */

import fs from 'fs';
import http from 'http';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { rollup } from 'rollup';

const require = createRequire(import.meta.url);
const browserDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(browserDir, '..', '..');
const testDir = path.join(root, 'test');

const ENGINES = ['chromium', 'firefox', 'webkit'];
const BUNDLES = ['validator.min.js', 'validator.js'];

// Files under test/ that are not run in browsers, and why.
const EXCLUDED_FILES = {
  'clientSide.test.js': 'loads validator.js and validator.min.js with Node.js require() (the CommonJS ' +
    'branch of the UMD wrapper); here both bundles run the whole suite through <script> instead',
  'esModules.test.js': 'inspects es/ with fs and loads it in Node.js; es-modules.html loads es/ in browsers',
  'testFunctions.js': 'helper imported by the test files, not a test file',
  'readme.test.js': 'reads README.md and the source with fs; it checks repository metadata, not the runtime',
  'util.test.js': 'tests internal helpers (src/lib/util/*) that the browser bundle does not expose',
  'version.test.js': 'reads package.json, jsr.json and the source with fs; it checks repository metadata',
};

// Tests (by full title) in the bundled files that are not run in browsers.
const EXCLUDED_TESTS = {
  'Validators should define the module using an AMD-compatible loader':
    'emulates an AMD loader with Node.js vm; amd.html uses a real one (RequireJS)',
  'Validators should bind validator to the window if no module loaders are available':
    'emulates a browser global object with Node.js vm; global.html uses a real browser',
  'CommonJS entry point should keep its exports as plain writable data properties':
    'tests the CommonJS build (index.js) and the require() cache',
  'CommonJS entry point should provide every export as a named export to native ES modules':
    'spawns Node.js to import the CommonJS build',
};

// Checked against the CommonJS build in Node.js and against every browser
// build: [function, arguments, expected result].
const SAMPLES = [
  ['isEmail', ['foo@bar.com'], true],
  ['isEmail', ['foo'], false],
  ['isEmail', ['hans@m端ller.com'], true],
  ['isMobilePhone', ['+14155552671', 'en-US'], true],
  ['isMobilePhone', ['123', 'any'], false],
  ['isAlpha', ['абв', 'ru-RU'], true],
  ['isAlpha', ['abc', 'ru-RU'], false],
  ['isIBAN', ['DE89370400440532013000'], true],
  ['isPostalCode', ['10001', 'US'], true],
  ['isUUID', ['A987FBC9-4BED-4078-8F07-9141BA07C9F3'], true],
  ['isURL', ['https://example.com/a?b=c#d'], true],
  ['isISO8601', ['2024-02-30', { strict: true }], false],
  ['isCreditCard', ['4716461583322103'], true],
  ['toBoolean', ['1'], true],
  ['trim', ['  foobar '], 'foobar'],
  ['escape', ['<a href="x">&</a>'], '&lt;a href=&quot;x&quot;&gt;&amp;&lt;&#x2F;a&gt;'],
  ['normalizeEmail', ['Foo.Bar+baz@GoogleMail.com'], 'foobar@gmail.com'],
];

const PAGE_TIMEOUT = { suite: 180000, smoke: 30000 };

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
};

function fail(message) {
  throw new Error(`browser tests: ${message}`);
}

function listTestFiles(dir) {
  return fs.readdirSync(dir).sort().reduce((files, name) => {
    const file = path.join(dir, name);
    if (name === 'node_modules') return files;
    if (fs.statSync(file).isDirectory()) return files.concat(listTestFiles(file));
    return /\.js$/.test(name) ? files.concat(file) : files;
  }, []);
}

function selectTestFiles() {
  const all = listTestFiles(testDir).map(file => path.relative(testDir, file).split(path.sep).join('/'));
  Object.keys(EXCLUDED_FILES).forEach((name) => {
    if (all.indexOf(name) === -1) fail(`EXCLUDED_FILES lists test/${name}, which does not exist`);
  });
  return all.filter(name => !EXCLUDED_FILES[name]);
}

// Maps `../src/lib/<name>` to the export that src/index.js gives its
// `locales`, e.g. isIBAN -> ibanLocales.
function readLocaleExports() {
  const source = fs.readFileSync(path.join(root, 'src', 'index.js'), 'utf8');
  const pattern = /import\s+(\w+)\s*,\s*\{\s*locales\s+as\s+(\w+)\s*\}\s*from\s*'\.\/lib\/(\w+)'/g;
  const map = {};
  let match = pattern.exec(source);
  while (match) {
    map[match[3]] = match[2];
    match = pattern.exec(source);
  }
  return map;
}

/*
 * A minimal CommonJS wrapper for timezone-mock (used by validators.test.js to
 * mock the local time zone), so that no CommonJS plugin is needed. The build
 * fails if the package starts requiring anything unexpected.
 */
function timezoneMockModule(assertId) {
  const dir = path.dirname(require.resolve('timezone-mock/package.json'));
  const files = ['index.js', 'lib/tzdata.js'];
  const builtins = ['assert'];
  const factories = files.map((file) => {
    const source = fs.readFileSync(path.join(dir, file), 'utf8');
    const requirePattern = /\brequire\(\s*(['"])([^'"]+)\1\s*\)/g;
    let match = requirePattern.exec(source);
    while (match) {
      const id = match[2];
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), id));
      if (builtins.indexOf(id) === -1 && files.indexOf(target) === -1) {
        fail(`timezone-mock/${file} requires ${JSON.stringify(id)}; add it to timezoneMockModule()`);
      }
      match = requirePattern.exec(source);
    }
    return `${JSON.stringify(file)}: function (module, exports, require) {\n${source}\n}`;
  });
  return `import assert from ${JSON.stringify(assertId)};
const builtins = { assert: assert };
const factories = {
${factories.join(',\n')}
};
const cache = {};
function load(file) {
  if (!cache[file]) {
    const module = { exports: {} };
    cache[file] = module;
    factories[file].call(module.exports, module, module.exports, function (id) {
      if (Object.prototype.hasOwnProperty.call(builtins, id)) return builtins[id];
      return load(new URL(id, 'file:///' + file).pathname.slice(1));
    });
  }
  return cache[file].exports;
}
export default load('index.js');
`;
}

function testBundlePlugin(testFiles, version) {
  const VIRTUAL = '\0browser-test:';
  const ENTRY = `${VIRTUAL}entry`;
  const VALIDATOR = `${VIRTUAL}validator`;
  const LIB = `${VIRTUAL}lib:`;
  const SHIM = `${VIRTUAL}shim:`;
  const fileShims = {
    assert: path.join(browserDir, 'shims', 'assert.mjs'),
    util: path.join(browserDir, 'shims', 'util.mjs'),
  };
  const virtualShims = {
    mocha: () => `const g = window;
export const describe = g.describe, it = g.it, before = g.before, after = g.after,
  beforeEach = g.beforeEach, afterEach = g.afterEach;
`,
    'timezone-mock': () => timezoneMockModule(fileShims.assert),
    // validators.test.js reads validator.js at import time, only for the two
    // vm tests in EXCLUDED_TESTS.
    fs: () => 'export default { readFileSync() { return \'\'; } };\n',
  };
  // Node.js modules that only excluded tests use. They are stubbed so that the
  // test files load; calling any of their functions throws.
  const unavailable = ['child_process', 'os', 'path', 'url', 'vm'];
  const libraryEntries = ['index', 'src', 'src/index', 'validator', 'validator.min'];
  const localeExports = readLocaleExports();

  return {
    name: 'validator-browser-tests',
    resolveId(source, importer) {
      if (source.indexOf(VIRTUAL) === 0) return source;
      if (!importer) return null;
      if (path.isAbsolute(source)) return source;
      if (/^\.\.?(\/|$)/.test(source)) {
        const resolved = path.resolve(path.dirname(importer), source);
        const relative = path.relative(root, resolved).split(path.sep).join('/').replace(/\.js$/, '');
        if (libraryEntries.indexOf(relative) !== -1) return VALIDATOR;
        const lib = /^src\/lib\/(\w+)$/.exec(relative);
        if (lib) return LIB + lib[1];
        if (relative.indexOf('test/') !== 0) {
          return this.error(`${importer} imports ${source}, which is neither a test file nor ` +
            'the library; map it in test/browser/run.mjs or exclude the test file');
        }
        return null;
      }
      if (fileShims[source]) return fileShims[source];
      if (virtualShims[source] || unavailable.indexOf(source) !== -1) return SHIM + source;
      return this.error(`${importer} imports ${JSON.stringify(source)}, which has no browser shim; ` +
        'add one in test/browser/run.mjs or exclude the test file');
    },
    load(id) {
      if (id === ENTRY) {
        return `${testFiles.map(file => `import ${JSON.stringify(path.join(testDir, file))};`).join('\n')}
window.validatorTestConfig = ${JSON.stringify({ testFiles, excludedTests: Object.keys(EXCLUDED_TESTS) })};
`;
      }
      if (id === VALIDATOR) {
        return `const validator = window.validator;
if (!validator || typeof validator.isEmail !== 'function') {
  throw new Error('browser tests: the UMD bundle did not define the global \`validator\`');
}
export default validator;
`;
      }
      if (id.indexOf(LIB) === 0) {
        const name = id.slice(LIB.length);
        const locales = localeExports[name]
          ? `export const locales = validator.${localeExports[name]};\n` : '';
        return `import validator from ${JSON.stringify(VALIDATOR)};
if (typeof validator.${name} !== 'function') {
  throw new Error('browser tests: the bundle does not export ${name}');
}
export default validator.${name};
${locales}`;
      }
      if (id.indexOf(SHIM) === 0) {
        const name = id.slice(SHIM.length);
        if (virtualShims[name]) return virtualShims[name]();
        return {
          code: `export default new Proxy({}, {
  get(target, key) {
    return function () {
      throw new Error('${name}.' + String(key) + ' is not available in the browser tests');
    };
  },
});
`,
          syntheticNamedExports: 'default',
        };
      }
      return null;
    },
    // Free variables of the Node.js test files (compiled to CommonJS by Babel
    // for Mocha in Node.js), defined inside the bundle's function scope only.
    intro: `var require = function (id) {
  if (id === '../package.json') return { version: ${JSON.stringify(version)} };
  throw new Error('require(' + JSON.stringify(id) + ') is not available in the browser tests');
};
require.resolve = function (id) { return id; };
var Buffer = {
  from: function (string) {
    return {
      toString: function (encoding) {
        if (typeof string !== 'string' || encoding !== 'base64') {
          throw new Error('browser tests: the Buffer shim only supports Buffer.from(string).toString("base64")');
        }
        var binary = '';
        new TextEncoder().encode(string).forEach(function (byte) { binary += String.fromCharCode(byte); });
        return btoa(binary);
      },
    };
  },
};`,
    entry: ENTRY,
  };
}

async function buildTestBundle(version) {
  const testFiles = selectTestFiles();
  const plugin = testBundlePlugin(testFiles, version);
  const warnings = [];
  const bundle = await rollup({
    input: plugin.entry,
    plugins: [plugin],
    treeshake: false,
    onwarn(warning) {
      warnings.push(warning.message);
    },
  });
  const { output } = await bundle.generate({ format: 'iife' });
  await bundle.close();
  if (warnings.length) fail(`Rollup warnings while bundling the tests:\n${warnings.join('\n')}`);
  return { code: output[0].code, testFiles };
}

function computeExpected(version) {
  const cjs = require(path.join(root, 'index.js')); // eslint-disable-line import/no-dynamic-require
  const keys = Object.keys(cjs).filter(key => key !== 'default').sort();
  SAMPLES.forEach(([name, args, result]) => {
    const actual = cjs[name](...args);
    if (!Object.is(actual, result)) {
      fail(`sample ${name}(${JSON.stringify(args).slice(1, -1)}) is ${JSON.stringify(actual)} in the ` +
        `CommonJS build, expected ${JSON.stringify(result)}; fix SAMPLES or the build`);
    }
  });
  if (cjs.version !== version) fail(`index.js has version ${cjs.version}, package.json ${version}`);
  return { version, keys, samples: SAMPLES };
}

function startServer(generated) {
  const vendor = {};
  const routes = {
    '/vendor/mocha.js': () => require.resolve('mocha/mocha.js'),
    '/vendor/mocha.css': () => require.resolve('mocha/mocha.css'),
    '/vendor/require.js': () => require.resolve('requirejs/require.js'),
  };
  const rootFiles = BUNDLES.reduce((map, name) => Object.assign(map, { [`/${name}`]: path.join(root, name) }), {});

  function within(dir, relative) {
    const file = path.resolve(dir, `.${path.posix.normalize(`/${relative}`)}`);
    return file.indexOf(dir + path.sep) === 0 ? file : null;
  }

  function resolveFile(pathname) {
    if (routes[pathname]) {
      if (!vendor[pathname]) vendor[pathname] = routes[pathname]();
      return vendor[pathname];
    }
    if (rootFiles[pathname]) return rootFiles[pathname];
    if (pathname.indexOf('/es/') === 0) return within(path.join(root, 'es'), pathname.slice(4));
    if (/^\/test\/browser\/[\w-]+\.(html|mjs)$/.test(pathname)) return path.join(browserDir, pathname.slice(14));
    return null;
  }

  function send(response, status, type, body) {
    response.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    response.end(body);
  }

  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      send(response, 405, 'text/plain', 'Method not allowed');
      return;
    }
    if (generated[pathname]) {
      send(response, 200, CONTENT_TYPES[path.extname(pathname)], generated[pathname]);
      return;
    }
    let file;
    try {
      file = resolveFile(pathname);
    } catch (error) {
      send(response, 500, 'text/plain', `${error.message}\n`);
      return;
    }
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      send(response, 404, 'text/plain', `Not found: ${pathname}\n`);
      return;
    }
    let body = fs.readFileSync(file);
    if (path.extname(file) === '.html') {
      const bundle = url.searchParams.get('bundle') || BUNDLES[0];
      if (BUNDLES.indexOf(bundle) === -1) {
        send(response, 400, 'text/plain', `Unknown bundle ${bundle}\n`);
        return;
      }
      body = String(body).replace(/__BUNDLE__/g, bundle);
    }
    send(response, 200, CONTENT_TYPES[path.extname(file)] || 'application/octet-stream', body);
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function pagesToRun() {
  const page = (kind, name, file, bundle) => ({
    kind,
    name,
    path: `/test/browser/${file}${bundle ? `?bundle=${bundle}` : ''}`,
    bundle,
  });
  return BUNDLES.map(bundle => page('suite', `Mocha suite, <script src="${bundle}">`, 'suite.html', bundle))
    .concat(...BUNDLES.map(bundle => [
      page('smoke', `global, <script src="${bundle}">`, 'global.html', bundle),
      page('smoke', `AMD, RequireJS loads ${bundle}`, 'amd.html', bundle),
    ]))
    .concat(page('smoke', 'ES modules, <script type="module"> imports es/', 'es-modules.html'));
}

function checkSuiteResult(result, problems) {
  const excluded = Object.keys(EXCLUDED_TESTS);
  const missing = excluded.filter(title => result.excludedFound.indexOf(title) === -1);
  if (missing.length) {
    problems.push(`EXCLUDED_TESTS lists tests that do not exist (update run.mjs):\n  ${missing.join('\n  ')}`);
  }
  result.failures.forEach((failure) => {
    problems.push(`${failure.title}\n    ${failure.message.split('\n').join('\n    ')}`);
  });
  const expectedRuns = result.defined - result.excludedFound.length;
  if (result.passes + result.failures.length + result.pending < expectedRuns) {
    problems.push(`only ${result.passes + result.failures.length + result.pending} of ${expectedRuns} tests ran`);
  }
  if (result.passes === 0) problems.push('no test passed');
  return `${result.passes} passing, ${result.failures.length} failing, ${result.pending} pending, ` +
    `${result.excludedFound.length} excluded`;
}

async function runPage(browser, baseUrl, spec) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const problems = [];
  const served = [];
  let abort;
  const aborted = new Promise((resolve, reject) => {
    abort = reject;
  });
  const problem = (message) => {
    problems.push(message);
    abort(new Error(message));
  };
  page.on('pageerror', error => problem(`uncaught exception: ${error.stack || error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') problem(`console.error: ${message.text()}`);
  });
  page.on('requestfailed', request => problem(`request failed: ${request.url()} (${request.failure().errorText})`));
  page.on('response', (response) => {
    const { pathname } = new URL(response.url());
    if (response.status() >= 400) problem(`HTTP ${response.status()} for ${pathname}`);
    else served.push(pathname);
  });

  const started = Date.now();
  let result;
  try {
    await Promise.race([
      page.goto(baseUrl + spec.path),
      aborted,
    ]);
    await Promise.race([
      page.waitForFunction(() => (window.validatorTestResult || {}).done, null, {
        timeout: PAGE_TIMEOUT[spec.kind],
        polling: 100,
      }),
      aborted,
    ]);
    result = await page.evaluate(() => window.validatorTestResult);
  } catch (error) {
    if (problems.indexOf(error.message) === -1) problems.push(error.message);
  } finally {
    await context.close();
  }

  let summary = '';
  if (result) {
    if (spec.bundle && served.indexOf(`/${spec.bundle}`) === -1) {
      problems.push(`the page did not load /${spec.bundle}`);
    }
    if (spec.kind === 'suite') {
      summary = checkSuiteResult(result, problems);
    } else if (result.ok) {
      summary = result.details;
    } else {
      problems.push(result.error);
    }
  }
  return { problems, summary, seconds: (Date.now() - started) / 1000 };
}

function parseArgs(argv) {
  const options = { engines: ENGINES, serve: false };
  argv.forEach((arg) => {
    const browsers = /^--browsers?=(.*)$/.exec(arg);
    if (browsers) {
      options.engines = browsers[1].split(',').map(name => name.trim()).filter(Boolean);
      options.engines.forEach((name) => {
        if (ENGINES.indexOf(name) === -1) fail(`unknown browser ${name}; use ${ENGINES.join(', ')}`);
      });
    } else if (arg === '--serve') {
      options.serve = true;
    } else {
      fail(`unknown argument ${arg}`);
    }
  });
  return options;
}

function loadPlaywright() {
  try {
    require.resolve('requirejs/require.js');
    return require('playwright'); // eslint-disable-line import/no-unresolved
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    return fail(`${error.message.split('\n')[0]}\nInstall Playwright and RequireJS as described at the ` +
      'top of test/browser/run.mjs');
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  ['validator.js', 'validator.min.js', 'index.js', 'es/index.js'].forEach((file) => {
    if (!fs.existsSync(path.join(root, file))) fail(`${file} does not exist; run \`npm run build\` first`);
  });
  const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const expected = computeExpected(version);
  const { code, testFiles } = await buildTestBundle(version);
  console.log(`Bundled ${testFiles.length} test files: ${testFiles.join(', ')}`);
  console.log(`Excluded files: ${Object.keys(EXCLUDED_FILES).join(', ')}`);
  console.log(`Excluded tests: ${Object.keys(EXCLUDED_TESTS).length}`);
  const playwright = options.serve ? null : loadPlaywright();

  const server = await startServer({
    '/build/tests.js': code,
    '/build/expected.json': JSON.stringify(expected),
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const pages = pagesToRun();

  if (options.serve) {
    console.log(`\nServing on ${baseUrl} (Ctrl+C to stop):`);
    pages.forEach(page => console.log(`  ${baseUrl}${page.path}`));
    return;
  }

  let failed = 0;
  const totals = [];
  try {
    for (const engine of options.engines) { // eslint-disable-line no-restricted-syntax
      const started = Date.now();
      // eslint-disable-next-line no-await-in-loop
      const browser = await playwright[engine].launch();
      console.log(`\n${engine} ${browser.version()}`);
      let engineFailed = 0;
      try {
        for (const spec of pages) { // eslint-disable-line no-restricted-syntax
          // eslint-disable-next-line no-await-in-loop
          const outcome = await runPage(browser, baseUrl, spec);
          const status = outcome.problems.length ? 'FAIL' : 'ok  ';
          console.log(`  ${status} ${spec.name}: ${outcome.summary || '-'} (${outcome.seconds.toFixed(1)}s)`);
          outcome.problems.slice(0, 20).forEach(message => console.log(`       ${message}`));
          if (outcome.problems.length > 20) console.log(`       ... and ${outcome.problems.length - 20} more`);
          if (outcome.problems.length) engineFailed += 1;
        }
      } finally {
        await browser.close(); // eslint-disable-line no-await-in-loop
      }
      failed += engineFailed;
      totals.push(`${engine}: ${engineFailed ? `${engineFailed} page(s) failed` : 'ok'} in ` +
        `${((Date.now() - started) / 1000).toFixed(1)}s`);
    }
  } finally {
    server.close();
  }
  console.log(`\n${totals.join('\n')}`);
  if (failed) {
    console.error(`\n${failed} browser page run(s) failed`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
