#!/usr/bin/env node
/*
 * Checks the npm package the way users receive it: from the packed tarball.
 * Used by the `package`, `deno` and `bun` CI jobs. Needs a built tree
 * (`npm run build`) and Node.js 20+ to run this script.
 *
 *   1. Packs the package with `npm pack` (or uses --tarball).
 *   2. Checks the tarball file list: the entry points, README.md, LICENSE,
 *      lib/ and es/ mirroring src/, and nothing else (no src/, test/,
 *      scripts/, jsr.json, ...).
 *   3. Runs publint on the tarball and fails on any error or warning except
 *      the accepted ones listed below.
 *   4. Installs the tarball into a scratch consumer project with each package
 *      manager and runs test/fixtures/consumers/{cjs.cjs,esm.mjs} with the
 *      selected runtime.
 *   5. Bundles small entry points with esbuild, runs the bundles, checks that
 *      importing one validator from es/lib/ is tree-shaken, and prints the
 *      bundle sizes.
 *
 * Usage:
 *   node scripts/check-package.mjs [--runtime=node|deno|bun] [--pm=npm,pnpm,yarn]
 *                                  [--tarball=file.tgz] [--skip=publint,bundle] [--keep]
 *
 * Defaults: --runtime=node runs every step with npm, pnpm and yarn;
 * --runtime=deno uses npm only and --runtime=bun uses `bun install`, and both
 * skip publint and the bundle step, which do not depend on the runtime.
 *
 * The tools are pinned here and run with `npx --yes` rather than being
 * devDependencies, because the main test matrix installs the devDependencies
 * with old Node.js versions that these tools do not support.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const TOOLS = {
  publint: 'publint@0.3.25',
  esbuild: 'esbuild@0.28.2',
  // pnpm 11+ needs Node.js 22.13+; pnpm 10 still runs on every Node.js
  // version in the CI matrix of this check.
  pnpm: 'pnpm@10.34.6',
  // Yarn Modern (Berry). Corepack is no longer bundled with Node.js 25+, so
  // Yarn is run from npm instead. It installs with Plug'n'Play by default.
  yarn: '@yarnpkg/cli-dist@4.18.1',
};

// publint warnings that are reviewed and accepted. Keep this list short and
// explain each entry.
const ACCEPTED_PUBLINT_WARNINGS = [
  // index.js is Babel output that sets `exports.__esModule` and
  // `exports.default`, then replaces module.exports with the validator object
  // and sets `module.exports.default` to that same object
  // (babel-plugin-add-module-exports with addDefaultProperty). publint only
  // sees the static pattern; at run time module.exports has no __esModule
  // flag and `default` is the object itself, so a default import gets the
  // validator object under every interop rule. The `cjs-root-default.js`
  // bundle below checks this with esbuild.
  /^pkg\.main sets both exports\.__esModule = true and exports\.default\./,
];

// Code that must not end up in a bundle that only imports isEmail: the
// isIBAN data table. And code that must be there: an isEmail option name.
const UNRELATED_MARKER = 'AD[0-9]{2}';
const IMPORTED_MARKER = 'allow_display_name';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtures = path.join(root, 'test', 'fixtures', 'consumers');

function parseArgs(args) {
  const parsed = { runtime: 'node', skip: [], keep: false };
  args.forEach((arg) => {
    const match = /^--([a-z]+)(?:=(.*))?$/.exec(arg);
    if (!match) throw new Error(`unknown argument ${arg}`);
    const [, name, value] = match;
    if (name === 'keep') parsed.keep = true;
    else if (name === 'runtime') parsed.runtime = value;
    else if (name === 'pm') parsed.pm = value.split(',');
    else if (name === 'skip') parsed.skip = value.split(',');
    else if (name === 'tarball') parsed.tarball = path.resolve(value);
    else throw new Error(`unknown argument ${arg}`);
  });
  if (['node', 'deno', 'bun'].indexOf(parsed.runtime) === -1) {
    throw new Error(`unknown runtime ${parsed.runtime}`);
  }
  if (!parsed.pm) {
    parsed.pm = { node: ['npm', 'pnpm', 'yarn'], deno: ['npm'], bun: ['bun'] }[parsed.runtime];
  }
  if (parsed.runtime !== 'node') parsed.skip.push('publint', 'bundle');
  return parsed;
}

const options = parseArgs(process.argv.slice(2));
const failures = [];

function step(title) {
  console.log(`\n=== ${title}`);
}

function fail(message) {
  failures.push(message);
  console.log(`FAIL: ${message}`);
}

function run(command, args, { cwd = root, env, capture = false } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
  });
  if (result.error) throw result.error;
  return result;
}

function runOrThrow(command, args, opts) {
  const result = run(command, args, opts);
  if (result.status !== 0) {
    if (result.stdout) console.log(result.stdout);
    if (result.stderr) console.log(result.stderr);
    throw new Error(`${command} ${args.join(' ')} exited with ${result.status}`);
  }
  return result;
}

function npx(spec, bin, args) {
  return ['npx', ['--yes', `--package=${spec}`, '--', bin, ...args]];
}

function listFiles(dir, base = dir) {
  return fs.readdirSync(dir).reduce((files, name) => {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) return files.concat(listFiles(file, base));
    return files.concat(path.relative(base, file).split(path.sep).join('/'));
  }, []);
}

function pack(dir) {
  step('npm pack');
  const result = runOrThrow('npm', ['pack', '--json', '--pack-destination', dir], { capture: true });
  const json = result.stdout.slice(result.stdout.indexOf('['));
  const [{ filename }] = JSON.parse(json);
  const tarball = path.join(dir, filename);
  console.log(tarball);
  return tarball;
}

function checkFiles(tarball) {
  step('tarball contents');
  const entries = runOrThrow('tar', ['-tzf', tarball], { capture: true }).stdout
    .split('\n').filter(Boolean).filter(entry => !/\/$/.test(entry));
  const outside = entries.filter(entry => entry.indexOf('package/') !== 0);
  if (outside.length) fail(`entries outside package/: ${outside.join(', ')}`);
  const files = entries.map(entry => entry.replace(/^package\//, ''));

  // src/index.js -> index.js and es/index.js; src/lib/x.js -> lib/x.js and es/lib/x.js.
  // Babel skips dotfiles such as src/.eslintrc.js, so they are not modules.
  const modules = listFiles(path.join(root, 'src'))
    .filter(file => /\.js$/.test(file) && !/(^|\/)\./.test(file));
  const expected = [
    'package.json', 'README.md', 'LICENSE',
    'validator.js', 'validator.min.js', 'es/package.json',
  ].concat(modules, modules.map(file => `es/${file}`));

  const missing = expected.filter(file => files.indexOf(file) === -1);
  const unexpected = files.filter(file => expected.indexOf(file) === -1);
  if (missing.length) fail(`missing from the tarball: ${missing.join(', ')}`);
  if (unexpected.length) fail(`unexpected in the tarball: ${unexpected.join(', ')}`);
  console.log(`${files.length} files (${modules.length} modules in lib/ and es/)`);
}

function checkPublint(tarball) {
  step(`publint (${TOOLS.publint})`);
  const [command, args] = npx(TOOLS.publint, 'publint', ['run', tarball]);
  const result = run(command, args, { capture: true, env: { NO_COLOR: '1' } });
  // eslint-disable-next-line no-control-regex
  const output = `${result.stdout}${result.stderr}`.replace(/\u001b\[[0-9;]*m/g, '');
  console.log(output.trim());

  let level = null;
  const messages = [];
  output.split('\n').forEach((line) => {
    const heading = /^(Errors|Warnings|Suggestions):$/.exec(line.trim());
    const item = /^\d+\. (.*)$/.exec(line.trim());
    if (heading) level = heading[1];
    else if (item && level) messages.push({ level, text: item[1] });
  });
  if (result.status !== 0 && !messages.some(message => message.level === 'Errors')) {
    fail(`publint exited with ${result.status}`);
  }
  messages.forEach(({ level: messageLevel, text }) => {
    if (messageLevel === 'Suggestions') return;
    if (messageLevel === 'Warnings' && ACCEPTED_PUBLINT_WARNINGS.some(re => re.test(text))) {
      console.log(`accepted warning: ${text}`);
      return;
    }
    fail(`publint ${messageLevel.toLowerCase()}: ${text}`);
  });
}

function install(pm, dir, tarball) {
  step(`install with ${pm}`);
  fs.mkdirSync(dir);
  fs.copyFileSync(tarball, path.join(dir, 'validator.tgz'));
  fs.writeFileSync(path.join(dir, 'package.json'), `${JSON.stringify({
    name: `validator-consumer-${pm}`,
    version: '0.0.0',
    private: true,
    dependencies: { validator: 'file:./validator.tgz' },
  }, null, 2)}\n`);
  ['cjs.cjs', 'esm.mjs'].forEach((file) => {
    fs.copyFileSync(path.join(fixtures, file), path.join(dir, file));
  });

  const env = {};
  let command;
  if (pm === 'npm') {
    command = ['npm', ['install', '--no-audit', '--no-fund', '--no-package-lock']];
  } else if (pm === 'pnpm') {
    // CI=true makes pnpm default to --frozen-lockfile, and there is no lockfile.
    command = npx(TOOLS.pnpm, 'pnpm', ['install', '--no-frozen-lockfile']);
  } else if (pm === 'yarn') {
    // Mark the directory as a project root, allow creating the lockfile in CI,
    // and generate the PnP ESM loader, which Yarn otherwise only enables when
    // a workspace or dependency has "type": "module" at its root.
    fs.writeFileSync(path.join(dir, 'yarn.lock'), '');
    Object.assign(env, {
      YARN_ENABLE_IMMUTABLE_INSTALLS: 'false',
      YARN_ENABLE_TELEMETRY: '0',
      YARN_PNP_ENABLE_ESM_LOADER: 'true',
    });
    command = npx(TOOLS.yarn, 'yarn', ['install']);
  } else if (pm === 'bun') {
    command = ['bun', ['install', '--no-save']];
  } else {
    throw new Error(`unknown package manager ${pm}`);
  }
  runOrThrow(command[0], command[1], { cwd: dir, env });
  return env;
}

function runFixtures(pm, dir, env) {
  ['cjs.cjs', 'esm.mjs'].forEach((file) => {
    let command;
    if (options.runtime === 'deno') {
      command = ['deno', ['run', '--allow-read', '--allow-env', file]];
    } else if (options.runtime === 'bun') {
      command = ['bun', [file]];
    } else if (pm === 'yarn') {
      // Plug'n'Play: `yarn node` sets up the PnP resolver and ESM loader.
      command = npx(TOOLS.yarn, 'yarn', ['node', file]);
    } else {
      command = [process.execPath, [file]];
    }
    const label = `${options.runtime} ${file} (${pm})`;
    const result = run(command[0], command[1], { cwd: dir, env, capture: true });
    if (result.status === 0) {
      console.log(`${label}: ${result.stdout.trim().split('\n').pop()}`);
    } else {
      console.log(result.stdout, result.stderr);
      fail(`${label} exited with ${result.status}`);
    }
  });
}

// `treeShaken`: true = must not contain the unrelated marker, false = must
// contain it (a control that shows the marker check works), null = report only.
const BUNDLES = [
  {
    name: 'es-lib-isEmail.mjs',
    source: "import isEmail from 'validator/es/lib/isEmail.js';\n",
    call: 'isEmail',
    treeShaken: true,
  },
  {
    name: 'es-index-default.mjs',
    source: "import validator from 'validator/es/index.js';\n",
    call: 'validator.isEmail',
    treeShaken: null,
  },
  {
    name: 'cjs-root-named.mjs',
    source: "import { isEmail } from 'validator';\n",
    call: 'isEmail',
    treeShaken: false,
  },
  {
    // A .js file in a package without "type": the case of the accepted
    // publint warning (bundlers apply the __esModule interop here).
    name: 'cjs-root-default.js',
    source: "import validator from 'validator';\n",
    call: 'validator.isEmail',
    treeShaken: false,
  },
];

function checkBundles(dir) {
  step(`bundles (${TOOLS.esbuild}, --bundle --minify --format=esm --platform=browser)`);
  const out = path.join(dir, 'dist');
  const sizes = [];
  BUNDLES.forEach((bundle) => {
    const entry = path.join(dir, bundle.name);
    const outfile = path.join(out, bundle.name.replace(/\.m?js$/, '.mjs'));
    fs.writeFileSync(entry, `${bundle.source}console.log(JSON.stringify(${bundle.call}('foo@bar.com')));\n`);
    const [command, args] = npx(TOOLS.esbuild, 'esbuild', [
      entry, '--bundle', '--minify', '--format=esm', '--platform=browser',
      '--log-level=warning', `--outfile=${outfile}`,
    ]);
    runOrThrow(command, args, { cwd: dir });

    const code = fs.readFileSync(outfile, 'utf8');
    const result = run(process.execPath, [outfile], { capture: true });
    if (result.status !== 0 || result.stdout.trim() !== 'true') {
      fail(`${bundle.name}: running the bundle printed ${JSON.stringify(result.stdout.trim())} ${result.stderr}`);
    }
    if (code.indexOf(IMPORTED_MARKER) === -1) {
      fail(`${bundle.name}: the bundle does not contain isEmail ("${IMPORTED_MARKER}")`);
    }
    const unrelated = code.indexOf(UNRELATED_MARKER) !== -1;
    if (bundle.treeShaken === true && unrelated) {
      fail(`${bundle.name}: not tree-shaken, the bundle contains isIBAN ("${UNRELATED_MARKER}")`);
    }
    if (bundle.treeShaken === false && !unrelated) {
      fail(`${bundle.name}: expected the whole library ("${UNRELATED_MARKER}") in this control bundle`);
    }
    sizes.push({
      bundle: bundle.name,
      bytes: Buffer.byteLength(code),
      gzip: zlib.gzipSync(code).length,
      'contains isIBAN': unrelated,
    });
  });
  console.table(sizes);
}

function main() {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'validator-package-'));
  console.log(`runtime ${options.runtime}, package managers ${options.pm.join(', ')}, work dir ${work}`);
  try {
    const tarball = options.tarball || pack(work);
    checkFiles(tarball);
    if (options.skip.indexOf('publint') === -1) checkPublint(tarball);
    options.pm.forEach((pm) => {
      const dir = path.join(work, `consumer-${pm}`);
      const env = install(pm, dir, tarball);
      runFixtures(pm, dir, env);
      if (pm === options.pm[0] && options.skip.indexOf('bundle') === -1) checkBundles(dir);
    });
  } finally {
    if (options.keep) console.log(`\nkept ${work}`);
    else fs.rmSync(work, { recursive: true, force: true });
  }

  if (failures.length) {
    console.log(`\n${failures.length} check(s) failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('\nAll package checks passed.');
}

main();
