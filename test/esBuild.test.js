import assert from 'assert';
import fs from 'fs';
import path from 'path';

const esDir = path.join(__dirname, '..', 'es');

function listFiles(dir) {
  return fs.readdirSync(dir).reduce((files, name) => {
    const file = path.join(dir, name);
    return files.concat(fs.statSync(file).isDirectory() ? listFiles(file) : [file]);
  }, []);
}

describe('ES module build', () => {
  it('should use the file extension in relative import paths', () => {
    const files = listFiles(esDir).filter(file => path.extname(file) === '.js');
    let checked = 0;
    files.forEach((file) => {
      const code = fs.readFileSync(file, 'utf8');
      const importRegex = /^(?:import|export)\s[^;]*?\sfrom\s+['"]([^'"]+)['"]/gm;
      let match = importRegex.exec(code);
      while (match) {
        const specifier = match[1];
        if (specifier[0] === '.') {
          checked += 1;
          const target = path.resolve(path.dirname(file), specifier);
          assert.ok(
            path.extname(specifier) === '.js' && fs.existsSync(target) && fs.statSync(target).isFile(),
            `${path.relative(esDir, file)} imports "${specifier}", which is not a path to a file`
          );
        }
        match = importRegex.exec(code);
      }
    });
    assert.ok(checked > 0, 'No relative imports found in the ES module build. Run `npm run build:es`');
  });
});
