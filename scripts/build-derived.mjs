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

// Modes:
//   (default)  write README.md and index.qmd
//   --check    write nothing; fail if the tracked README.md is out of date
//   --index    write only index.qmd (git-ignored Quarto input)
const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');
const indexOnly = args.has('--index');

if (checkOnly && indexOnly) {
	throw new Error('Use either --check or --index, not both.');
}

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
const indexPath = path.join(ROOT_DIR, 'index.qmd');

if (checkOnly) {
	const expected = await prettier.format(buildReadme(entries), { filepath: readmePath });
	const actual = await fs.readFile(readmePath, 'utf8').catch(() => null);

	if (actual !== expected) {
		console.error('README.md is out of date. Run `npm run generate` and commit README.md.');
		process.exit(1);
	}

	console.log(`README.md is current for ${entries.length} entries.`);
} else if (indexOnly) {
	await fs.writeFile(indexPath, buildIndexQmd(entries));
	console.log(`Generated index.qmd for ${entries.length} entries.`);
} else {
	const readme = await prettier.format(buildReadme(entries), { filepath: readmePath });
	await fs.writeFile(readmePath, readme);
	await fs.writeFile(indexPath, buildIndexQmd(entries));
	console.log(`Generated README.md and index.qmd for ${entries.length} entries.`);
}
