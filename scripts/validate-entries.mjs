import process from 'node:process';
import { loadEntries, validateEntries } from './lib/entries.mjs';

const entries = await loadEntries();
const errors = await validateEntries(entries);

if (errors.length > 0) {
	for (const error of errors) {
		console.error(error);
	}
	process.exit(1);
}

console.log(`Validated ${entries.length} entries.`);
