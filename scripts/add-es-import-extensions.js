const fs = require('fs');
const path = require('path');

const ES_ROOT = path.join(__dirname, '..', 'es');

function addExtension(specifier) {
  if (specifier.endsWith('.js')) {
    return specifier;
  }

  return `${specifier}.js`;
}

function fixFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const updated = source.replace(
    /from ['"](\.\.?\/[^'"]+)['"]/g,
    (match, specifier) => match.replace(specifier, addExtension(specifier)),
  );

  if (updated !== source) {
    fs.writeFileSync(filePath, updated);
  }
}

function walk(directory) {
  for (const entryName of fs.readdirSync(directory)) {
    const entryPath = path.join(directory, entryName);

    if (fs.statSync(entryPath).isDirectory()) {
      walk(entryPath);
      continue;
    }

    if (entryName.endsWith('.js')) {
      fixFile(entryPath);
    }
  }
}

walk(ES_ROOT);
