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
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(entryPath);
      continue;
    }

    if (entry.name.endsWith('.js')) {
      fixFile(entryPath);
    }
  }
}

walk(ES_ROOT);
