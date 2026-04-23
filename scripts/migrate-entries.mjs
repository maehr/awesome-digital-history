import fs from 'node:fs/promises';
import path from 'node:path';
import {
	ENTRIES_DIR,
	ROOT_DIR,
	SCREENSHOT_DIR,
	buildEntryPage,
	classifyEntry,
	ensurePeriod,
	slugify
} from './lib/entries.mjs';

const sourcePath = path.join(ROOT_DIR, 'data', 'entries.json');
const raw = await fs.readFile(sourcePath, 'utf8');
const records = JSON.parse(raw);

await fs.mkdir(ENTRIES_DIR, { recursive: true });
await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

for (const record of records) {
	const slug = slugify(record.title);
	const entry = {
		title: record.title,
		slug,
		description: `Overview of ${record.title}, a digital history resource for ${record.region[0] || 'broader'} research and source discovery.`,
		external_url: record.url,
		short_description: ensurePeriod(record.description),
		section: classifyEntry(record),
		region: [...record.region],
		language: [...record.language],
		type: [...record.type],
		period: [...record.period],
		screenshot: `/assets/screenshots/${slug}.png`,
		screenshot_alt: `Screenshot of ${record.title}`,
		screenshot_hide: [],
		screenshot_wait_ms: 6000,
		screenshot_full_page: false
	};

	const body =
		'TODO: Replace this placeholder with an AI-generated first draft based on the source site.\n\n' +
		`${record.title} is listed here because ${record.description.charAt(0).toLowerCase()}${record.description.slice(1)}`;

	const content = buildEntryPage(entry, body);
	await fs.writeFile(path.join(ENTRIES_DIR, `${slug}.qmd`), content);
	console.log(`Created entries/${slug}.qmd`);
}
