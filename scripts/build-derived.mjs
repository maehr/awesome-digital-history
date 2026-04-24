import fs from 'node:fs/promises';
import path from 'node:path';
import prettier from 'prettier';
import {
	ROOT_DIR,
	buildIndexQmd,
	buildReadme,
	loadEntries,
	validateEntries
} from './lib/entries.mjs';

const entries = await loadEntries();
const errors = await validateEntries(entries);

if (errors.length > 0) {
	for (const error of errors) {
		console.error(error);
	}
	process.exitCode = 1;
	throw new Error('Entry validation failed.');
}

const readmePath = path.join(ROOT_DIR, 'README.md');
const readme = await prettier.format(buildReadme(entries), { filepath: readmePath });

await fs.writeFile(readmePath, readme);
await fs.writeFile(path.join(ROOT_DIR, 'index.qmd'), buildIndexQmd(entries));

console.log(`Generated README.md and index.qmd for ${entries.length} entries.`);
