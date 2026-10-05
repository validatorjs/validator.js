import assert from 'assert';
import fs from 'fs';
import path from 'path';

// Independent reference data from Unicode, rather than the pattern generator.
const types = [
  'Basic_Emoji',
  'Emoji_Keycap_Sequence',
  'RGI_Emoji_Flag_Sequence',
  'RGI_Emoji_Tag_Sequence',
  'RGI_Emoji_Modifier_Sequence',
  'RGI_Emoji_ZWJ_Sequence',
];

const emojis = [];
['emoji-sequences.txt', 'emoji-zwj-sequences.txt'].forEach((filename) => {
  const data = fs.readFileSync(path.join(__dirname, 'emoji-18.0', filename), 'utf8');
  assert.ok(data.includes('# Version: 18.0'));

  data.split('\n').forEach((line) => {
    const fields = line.split('#')[0].split(';').map(field => field.trim());
    if (!types.includes(fields[1])) return;

    if (fields[0].includes('..')) {
      const [first, last] = fields[0].split('..').map(point => parseInt(point, 16));
      for (let point = first; point <= last; point++) {
        emojis.push(String.fromCodePoint(point));
      }
    } else {
      const points = fields[0].split(/\s+/).map(point => parseInt(point, 16));
      emojis.push(String.fromCodePoint(...points));
    }
  });
});

export default Array.from(new Set(emojis));
