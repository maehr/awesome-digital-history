import fs from 'node:fs/promises';
import { buildEntryPage, extractNarrativeBody, loadEntries } from './lib/entries.mjs';

const entries = await loadEntries();

for (const entry of entries) {
	const body = extractNarrativeBody(entry.body);
	await fs.writeFile(entry.filePath, buildEntryPage(entry, body));
	console.log(`Rewrote ${entry.filename}`);
}
