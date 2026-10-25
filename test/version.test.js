import assert from 'assert';
import fs from 'fs';
import path from 'path';
import validator from '../src/index';

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'));
}

describe('Version', () => {
  // JSR reads the version from jsr.json only, so a release must bump all three.
  it('should be the same in package.json, jsr.json and src/index.js', () => {
    const pkg = readJson('package.json');
    const jsr = readJson('jsr.json');
    assert.ok(/^\d+\.\d+\.\d+$/.test(pkg.version), `unexpected package.json version ${pkg.version}`);
    assert.deepStrictEqual(
      { 'jsr.json': jsr.version, 'src/index.js': validator.version },
      { 'jsr.json': pkg.version, 'src/index.js': pkg.version }
    );
  });
});
