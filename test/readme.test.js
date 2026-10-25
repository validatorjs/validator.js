import assert from 'assert';
import fs from 'fs';
import path from 'path';
import validator from '../src/index';

const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');

// Returns the text of a `## <title>` section of the README.
function section(title) {
  const start = readme.indexOf(`\n## ${title}\n`);
  assert.notStrictEqual(start, -1, `README has no "## ${title}" section`);
  const end = readme.indexOf('\n## ', start + 1);
  return end === -1 ? readme.slice(start) : readme.slice(start, end);
}

// Names documented as table rows such as `**isEmail(str [, options])** | ...`.
function documentedFunctions(title) {
  const names = [];
  const row = /^\*\*([A-Za-z0-9_$]+)\(/gm;
  const text = section(title);
  let match = row.exec(text);
  while (match) {
    names.push(match[1]);
    match = row.exec(text);
  }
  return names;
}

function sorted(list) {
  return list.slice().sort();
}

function duplicates(list) {
  return list.filter((name, i) => list.indexOf(name) !== i);
}

describe('README', () => {
  // `default` is added by the CommonJS build (babel-plugin-add-module-exports).
  const keys = Object.keys(validator).filter(key => key !== 'default');
  const functions = keys.filter(key => typeof validator[key] === 'function');
  const localeLists = keys.filter(key => /Locales$/.test(key));

  it('should document every exported function exactly once, and nothing else', () => {
    const documented = documentedFunctions('Validators').concat(documentedFunctions('Sanitizers'));
    assert.ok(documented.length > 100, `expected the README tables, found ${documented.length} rows`);
    assert.deepStrictEqual(duplicates(documented), [], 'functions documented more than once');
    assert.deepStrictEqual(
      functions.filter(name => documented.indexOf(name) === -1),
      [],
      'exported functions missing from the README Validators/Sanitizers tables'
    );
    assert.deepStrictEqual(
      documented.filter(name => functions.indexOf(name) === -1),
      [],
      'README rows for functions that are not exported'
    );
  });

  it('should only export functions, locale lists and version', () => {
    const other = keys.filter(key => typeof validator[key] !== 'function');
    assert.deepStrictEqual(
      sorted(other),
      sorted(localeLists.concat('version')),
      'a new non-function export needs a README entry and a place in this test'
    );
    localeLists.forEach((key) => {
      assert.ok(Array.isArray(validator[key]), `${key} is not an array`);
    });
  });

  it('should document every exported locale list, and nothing else', () => {
    const mentioned = [];
    const reference = /`validator\.([A-Za-z0-9_$]+Locales)`/g;
    let match = reference.exec(readme);
    while (match) {
      if (mentioned.indexOf(match[1]) === -1) mentioned.push(match[1]);
      match = reference.exec(readme);
    }
    assert.deepStrictEqual(sorted(mentioned), sorted(localeLists));
  });
});
