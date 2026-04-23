import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { buildEntryPage, readEntry } from './lib/entries.mjs';

const draftPath = process.argv[2];

if (!draftPath) {
	throw new Error('Usage: node scripts/apply-drafts.mjs <drafts.json>');
}

const drafts = JSON.parse(await fs.readFile(path.resolve(draftPath), 'utf8'));

for (const draft of drafts) {
	const filePath = path.resolve('entries', `${draft.slug}.qmd`);
	const current = await readEntry(filePath);
	const next = {
		...current,
		description: draft.description.trim()
	};
	const content = buildEntryPage(next, draft.body.trim());
	await fs.writeFile(filePath, content);
	console.log(`Updated ${filePath}`);
}
