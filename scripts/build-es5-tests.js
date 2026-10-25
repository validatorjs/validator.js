/*
 * Compiles the Mocha test suite (test/**\/*.js) to ES5 in test-es5/, so the
 * real tests can run on Node.js versions where Mocha, nyc and npm install are
 * not available (see scripts/es5-test/run.js). Run it on a current Node.js
 * after `npm run build`:
 *
 *   node scripts/build-es5-tests.js && node test-es5/run.js
 *
 * Module specifiers are rewritten so that the compiled tests exercise the
 * built outputs instead of src/: `src/index` -> `index.js`, `src/lib/x` ->
 * `lib/x.js`; `../index`, `../validator` and `../validator.min` are kept.
 * test-es5/ is self-contained apart from those outputs and package.json:
 * it also holds the runner, `mocha` and `timezone-mock` stand-ins and a copy
 * of timezone-mock.
 */

'use strict';

const babel = require('@babel/core');
const presetEnv = require('@babel/preset-env');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const testDir = path.join(root, 'test');
const srcDir = path.join(root, 'src');
const outDir = path.join(root, 'test-es5');
const runnerDir = path.join(__dirname, 'es5-test');
const NODE_BUILTINS = ['assert', 'child_process', 'fs', 'os', 'path', 'url', 'util', 'vm'];
const vendored = {
  mocha: path.join(outDir, 'mocha.js'),
  'timezone-mock': path.join(outDir, 'timezone-mock.js'),
};
// Test files that cannot apply to ES5 runtimes, relative to test/, with the reason.
const EXCLUDED = {
  'esModules.test.js': 'covers native ES modules only and parses es/ with @babel/core',
  'readme.test.js': 'checks repository metadata, which does not depend on the runtime',
  'version.test.js': 'checks repository metadata, which does not depend on the runtime',
};

function listFiles(dir) {
  return fs.readdirSync(dir).sort().reduce((files, name) => {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) return files.concat(listFiles(file));
    return /\.js$/.test(name) ? files.concat(file) : files;
  }, []);
}

function isInside(dir, file) {
  const relative = path.relative(dir, file);
  return relative === '' || (relative.split(path.sep)[0] !== '..' && !path.isAbsolute(relative));
}

// Maps a specifier used in `fromFile` (under test/) to the file the compiled test should load.
function resolveTarget(specifier, fromFile) {
  if (NODE_BUILTINS.indexOf(specifier) !== -1) return null;
  if (vendored[specifier]) return vendored[specifier];
  if (!/^\.\.?\//.test(specifier)) {
    throw new Error(`${path.relative(root, fromFile)}: cannot run "${specifier}" without npm install; ` +
      'add it to scripts/build-es5-tests.js');
  }
  const target = path.resolve(path.dirname(fromFile), specifier);
  if (isInside(srcDir, target)) {
    const relative = path.relative(srcDir, target);
    if (relative === '' || relative === 'index' || relative === 'index.js') {
      return path.join(root, 'index.js');
    }
    return path.join(root, relative);
  }
  if (isInside(testDir, target)) return path.join(outDir, path.relative(testDir, target));
  return target;
}

function rewriteSpecifiers(fromFile, outFile) {
  function rewrite(literal) {
    const target = resolveTarget(literal.value, fromFile);
    if (target === null) return;
    let relative = path.relative(path.dirname(outFile), target).split(path.sep).join('/');
    if (!/^\.\.?\//.test(relative)) relative = `./${relative}`;
    literal.value = relative;
  }
  function isRequire(callee) {
    return (callee.type === 'Identifier' && callee.name === 'require') ||
      (callee.type === 'MemberExpression' && callee.object.type === 'Identifier' &&
        callee.object.name === 'require' && callee.property.name === 'resolve');
  }
  return {
    visitor: {
      'ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration': function (nodePath) {
        if (nodePath.node.source) rewrite(nodePath.node.source);
      },
      CallExpression(nodePath) {
        const { callee, arguments: args } = nodePath.node;
        if (isRequire(callee) && args.length > 0 && args[0].type === 'StringLiteral') {
          rewrite(args[0]);
        }
      },
    },
  };
}

function write(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

fs.rmSync(outDir, { recursive: true, force: true });

Object.keys(EXCLUDED).forEach((name) => {
  if (!fs.existsSync(path.join(testDir, name))) {
    throw new Error(`build-es5-tests: excluded test file ${name} does not exist; update EXCLUDED`);
  }
  console.log(`build-es5-tests: excluding ${name} (${EXCLUDED[name]})`);
});

const testFiles = listFiles(testDir)
  .filter(file => !EXCLUDED[path.relative(testDir, file).split(path.sep).join('/')]);
testFiles.forEach((file) => {
  const outFile = path.join(outDir, path.relative(testDir, file));
  const { code } = babel.transformFileSync(file, {
    babelrc: false,
    configFile: false,
    sourceType: 'module',
    presets: [[presetEnv, { targets: { node: '0.10' }, modules: 'commonjs' }]],
    plugins: [() => rewriteSpecifiers(file, outFile)],
  });
  write(outFile, code);
});

['runner.js', 'run.js', 'mocha.js', 'timezone-mock.js'].forEach((name) => {
  write(path.join(outDir, name), fs.readFileSync(path.join(runnerDir, name)));
});

const timezoneMock = path.dirname(require.resolve('timezone-mock/package.json'));
['index.js', 'lib/tzdata.js', 'LICENSE', 'package.json'].forEach((name) => {
  write(path.join(outDir, 'vendor', 'timezone-mock', name), fs.readFileSync(path.join(timezoneMock, name)));
});

const files = testFiles
  .filter(file => /\.test\.js$/.test(file))
  .map(file => `./${path.relative(testDir, file).split(path.sep).join('/')}`);
write(path.join(outDir, 'manifest.json'), `${JSON.stringify({ files }, null, 2)}\n`);

console.log(`build-es5-tests: compiled ${testFiles.length} files (${files.length} test files) to ${path.relative(root, outDir)}/`);
