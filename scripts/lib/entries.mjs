import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export const ROOT_DIR = process.cwd();
const ENTRIES_DIR = path.join(ROOT_DIR, 'entries');
export const SCREENSHOT_DIR = path.join(ROOT_DIR, 'assets', 'screenshots');

const SECTION_LABELS = {
	archives: 'Archives and primary sources',
	learning: 'Learning',
	'more-awesome': 'More Awesome'
};

const REGION_ORDER = [
	'Africa',
	'Asia',
	'Austria',
	'Europe',
	'France',
	'Germany',
	'Global',
	'Great Britain',
	'Latin America',
	'Netherlands',
	'North America',
	'Oceania',
	'Switzerland'
];

const SECTIONS = Object.keys(SECTION_LABELS);

// Controlled vocabularies for array fields. `languages` uses canonical BCP 47 instead.
const ALLOWED_VALUES = {
	regions: REGION_ORDER,
	resource_types: [
		'audiovisual sources',
		'books',
		'collection',
		'encyclopedias',
		'learning materials',
		'magazines',
		'manuscripts',
		'maps',
		'newspapers',
		'photos',
		'portal',
		'primary sources',
		'search engine',
		'sheet music',
		'statistics',
		'tools',
		'websites'
	],
	periods: [
		'prehistory',
		'ancient',
		'classical',
		'medieval',
		'early modern',
		'modern',
		'contemporary'
	]
};

function slugify(value) {
	return String(value)
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, '-');
}

function ensurePeriod(value) {
	const text = String(value || '').trim();
	return !text || /[.!?]$/.test(text) ? text : `${text}.`;
}

function isIsoDate(value) {
	const text =
		value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? '').trim();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
		return false;
	}
	const date = new Date(`${text}T00:00:00.000Z`);
	return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === text;
}

function isHttpUrl(value) {
	try {
		return ['http:', 'https:'].includes(new URL(value).protocol);
	} catch {
		return false;
	}
}

function canonicalLanguageTag(value) {
	try {
		return Intl.getCanonicalLocales(value.trim())[0] ?? null;
	} catch {
		return null;
	}
}

function escapeMarkdownText(value) {
	return String(value).replace(/([\\`*_[\]<>])/g, '\\$1');
}

function quoteList(values) {
	return values.map((value) => `'${value}'`).join(', ');
}

export async function loadEntries() {
	const names = (await fs.readdir(ENTRIES_DIR)).filter((name) => name.endsWith('.qmd'));
	const entries = await Promise.all(
		names.map(async (filename) => {
			const parsed = matter(await fs.readFile(path.join(ENTRIES_DIR, filename), 'utf8'));
			return {
				screenshot_hide: [],
				...parsed.data,
				filename,
				body: parsed.content.trim()
			};
		})
	);
	return entries.sort((left, right) => left.title.localeCompare(right.title));
}

const REQUIRED_STRINGS = [
	'title',
	'slug',
	'external_url',
	'short_description',
	'description',
	'directory_section',
	'section_label',
	'screenshot',
	'screenshot_alt',
	'image'
];

const ARRAY_FIELDS = [
	'regions',
	'languages',
	'resource_types',
	'periods',
	'authors',
	'contributors',
	'screenshot_hide'
];

function validateEntryShape(entry) {
	const errors = [];
	const fail = (message) => errors.push(`${entry.filename}: ${message}`);

	for (const key of REQUIRED_STRINGS) {
		if (typeof entry[key] !== 'string' || entry[key].trim().length === 0) {
			fail(`missing ${key}`);
		}
	}
	if (!Object.hasOwn(entry, 'date_added')) {
		fail('missing date_added');
	}
	for (const key of ARRAY_FIELDS) {
		const values = entry[key];
		if (!Array.isArray(values)) {
			fail(`${key} must be an array`);
		} else if (values.some((value) => typeof value !== 'string' || value.trim().length === 0)) {
			fail(`${key} values must be non-empty strings`);
		}
	}
	// The checks below assume the field types above are correct.
	if (errors.length > 0) {
		return errors;
	}

	for (const key of ARRAY_FIELDS) {
		const values = entry[key];
		const duplicates = new Set(values.filter((value, index) => values.indexOf(value) !== index));
		for (const value of duplicates) {
			fail(`${key} contains duplicate value '${value}'`);
		}
		const allowed = ALLOWED_VALUES[key] ?? values;
		for (const value of values.filter((value) => !allowed.includes(value))) {
			fail(`invalid ${key} value '${value}'; expected one of ${quoteList(allowed)}`);
		}
	}

	for (const language of entry.languages) {
		const canonical = canonicalLanguageTag(language);
		if (canonical === null) {
			fail(`invalid language tag '${language}'; expected canonical BCP 47`);
		} else if (language !== canonical) {
			fail(`language tag '${language}' must be canonical BCP 47 '${canonical}'`);
		}
	}

	if (!isIsoDate(entry.date_added)) {
		fail('date_added must be a real YYYY-MM-DD date');
	}

	const section = entry.directory_section;
	if (!SECTIONS.includes(section)) {
		fail(`invalid directory_section '${section}'; expected one of ${quoteList(SECTIONS)}`);
	}
	if (entry.section_label !== SECTION_LABELS[section]) {
		fail('section_label must match directory_section');
	}
	if (entry.slug !== slugify(entry.slug)) {
		fail('slug must be normalized');
	}
	if (entry.filename !== `${entry.slug}.qmd`) {
		fail('filename must match slug');
	}
	if (!isHttpUrl(entry.external_url)) {
		fail('external_url must be an absolute http(s) URL');
	}
	if (section === 'archives' && entry.regions.length === 0) {
		fail('archives entry needs a region');
	}
	if (section !== 'archives' && entry.regions.length > 0) {
		fail('only archives entries may define a region');
	}
	if (section === 'learning' && !entry.resource_types.includes('learning materials')) {
		fail("learning entry must include 'learning materials' type");
	}
	if (!/^## Why it matters\b/m.test(entry.body)) {
		fail("body must include '## Why it matters' heading");
	}
	if (entry.body.length < 140) {
		fail('body is too short');
	}
	if (entry.body.includes('TODO:')) {
		fail('body still contains TODO placeholder');
	}
	const descriptionLength = entry.description.trim().length;
	if (descriptionLength < 60 || descriptionLength > 180) {
		fail('description should be 60-180 characters for SEO');
	}
	if (!entry.short_description.trim().endsWith('.')) {
		fail('short_description must end with a period');
	}

	const screenshotPaths = [
		`/assets/screenshots/${entry.slug}.png`,
		`/assets/screenshots/${entry.slug}-placeholder.png`
	];
	if (!screenshotPaths.includes(entry.screenshot)) {
		fail(`screenshot path must be ${screenshotPaths.join(' or ')}`);
	}
	if (entry.image !== entry.screenshot) {
		fail('image must match screenshot');
	}

	return errors;
}

export async function validateEntries(entries) {
	const errors = [];
	const seenSlugs = new Set();
	const seenTitles = new Set();

	for (const entry of entries) {
		errors.push(...validateEntryShape(entry));
		if (seenSlugs.has(entry.slug)) {
			errors.push(`${entry.filename}: duplicate slug '${entry.slug}'`);
		}
		seenSlugs.add(entry.slug);

		if (seenTitles.has(entry.title)) {
			errors.push(`${entry.filename}: duplicate title '${entry.title}'`);
		}
		seenTitles.add(entry.title);

		if (typeof entry.screenshot === 'string') {
			try {
				await fs.access(path.join(ROOT_DIR, entry.screenshot.replace(/^\//, '')));
			} catch {
				errors.push(`${entry.filename}: missing screenshot '${entry.screenshot}'`);
			}
		}
	}

	return errors;
}

export function buildReadme(entries) {
	const archives = entries.filter((entry) => entry.directory_section === 'archives');
	const learning = entries.filter((entry) => entry.directory_section === 'learning');
	const moreAwesome = entries.filter((entry) => entry.directory_section === 'more-awesome');

	const lines = [
		'# Awesome Digital History [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)',
		'',
		'> Find primary sources online and learn how to research history digitally.',
		'',
		'Finding aids for textual and multimedia [primary sources](https://en.wikipedia.org/wiki/Primary_source) with a focus on the western hemisphere and the 19th and 20th centuries. Courses and learning tools to explore history digitally.',
		'',
		'## Contents',
		'',
		'- [Archives and primary sources](#archives-and-primary-sources)'
	];

	for (const region of REGION_ORDER) {
		if (archives.some((entry) => entry.regions.includes(region))) {
			lines.push(`  - [${region}](#${slugify(region)})`);
		}
	}

	lines.push('- [Learning](#learning)');
	lines.push('- [More Awesome](#more-awesome)');
	lines.push('- [Contribute](#contribute)');
	lines.push('');
	lines.push('## Archives and primary sources');
	lines.push('');

	for (const region of REGION_ORDER) {
		const items = archives.filter((entry) => entry.regions.includes(region));
		if (items.length === 0) {
			continue;
		}
		lines.push(`### ${region}`);
		lines.push('');
		for (const entry of items) {
			lines.push(
				`- [${escapeMarkdownText(entry.title)}](${entry.external_url}) - ${ensurePeriod(entry.short_description)}`
			);
		}
		lines.push('');
	}

	lines.push('## Learning');
	lines.push('');
	for (const entry of learning) {
		lines.push(
			`- [${escapeMarkdownText(entry.title)}](${entry.external_url}) - ${ensurePeriod(entry.short_description)}`
		);
	}
	lines.push('');
	lines.push('## More Awesome');
	lines.push('');
	for (const entry of moreAwesome) {
		lines.push(
			`- [${escapeMarkdownText(entry.title)}](${entry.external_url}) - ${ensurePeriod(entry.short_description)}`
		);
	}
	lines.push('');
	lines.push('## Contribute');
	lines.push('');
	lines.push(
		'Contributions welcome! Read the [CONTRIBUTING.md](https://github.com/maehr/awesome-digital-history/blob/main/CONTRIBUTING.md) and [Editorial Policy](https://github.com/maehr/awesome-digital-history/blob/main/EDITORIAL_POLICY.md) first. To propose a new resource, open an [Addition issue](https://github.com/maehr/awesome-digital-history/issues/new?template=addition.yml) and wait for maintainer approval.'
	);
	lines.push('');

	return `${lines.join('\n')}\n`;
}

function filterHref(name, value) {
	const params = new URLSearchParams([[name, value]]);
	return `?${params.toString()}#directory-${name}`;
}

function filterBadge(name, value, label = value, isPrimary = false) {
	const classes = [
		'badge rounded-pill border text-decoration-none metadata-badge',
		`metadata-badge--${name}`,
		isPrimary ? 'metadata-badge--primary' : ''
	]
		.filter(Boolean)
		.join(' ');

	return `<a class="${classes}" href="${escapeHtml(filterHref(name, value))}" data-filter-chip="${escapeHtml(name)}" data-filter-value="${escapeHtml(value)}">${escapeHtml(label)}</a>`;
}

function cardBadges(entry) {
	const badges = [filterBadge('section', entry.directory_section, entry.section_label, true)];

	for (const region of entry.regions) {
		badges.push(filterBadge('region', region));
	}
	for (const language of entry.languages) {
		badges.push(filterBadge('language', language));
	}
	for (const type of entry.resource_types) {
		badges.push(filterBadge('type', type));
	}
	for (const period of entry.periods) {
		badges.push(filterBadge('period', period));
	}

	return badges.join('');
}

function optionList(entries, key) {
	const values = [...new Set(entries.flatMap((entry) => entry[key]))].sort((a, b) =>
		a.localeCompare(b)
	);
	return values
		.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
		.join('\n');
}

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export function buildIndexQmd(entries) {
	const cards = entries
		.map((entry) => {
			const searchParts = [
				entry.title,
				entry.short_description,
				entry.description,
				...entry.regions,
				...entry.resource_types,
				...entry.languages,
				...entry.periods
			];

			return `<article data-entry-card data-search="${escapeHtml(searchParts.join(' '))}" data-section="${escapeHtml(entry.directory_section)}" data-region="${escapeHtml(entry.regions.join('|'))}" data-type="${escapeHtml(entry.resource_types.join('|'))}" data-language="${escapeHtml(entry.languages.join('|'))}" data-period="${escapeHtml(entry.periods.join('|'))}">
<div class="card h-100 shadow-sm border-0 w-100">
<a class="text-decoration-none" href="entries/${entry.slug}.html">
<div class="ratio ratio-16x9">
<img class="w-100 h-100 object-fit-cover" src="${escapeHtml(entry.screenshot)}" alt="${escapeHtml(entry.screenshot_alt)}">
</div>
</a>
<div class="card-body d-flex flex-column gap-3">
<div>
<h3 class="card-title h5 mb-2"><a class="link-body-emphasis text-decoration-none" href="entries/${entry.slug}.html">${escapeHtml(entry.title)}</a></h3>
<p class="card-text text-body-secondary mb-0">${escapeHtml(entry.short_description)}</p>
</div>
<p class="mb-0 d-flex flex-wrap gap-2">${cardBadges(entry)}</p>
</div>
<div class="card-footer bg-transparent border-0 pt-0 pb-3 px-3">
<div class="d-flex gap-2 flex-wrap">
<a class="btn btn-sm btn-primary" href="${escapeHtml(entry.external_url)}" rel="noopener noreferrer">Visit resource</a>
</div>
</div>
</div>
</article>`;
		})
		.join('\n');

	return `---
title: Awesome Digital History
page-layout: full
toc: false
---

# Awesome Digital History

::: {.lead .mb-4}
A curated directory of digital history resources for finding sources, tools, and learning materials for historical research.
:::

::: {.card .bg-body-tertiary .border-0 .shadow-sm .mb-4}
::: {.card-body}
<div class="d-grid gap-3" data-filter-grid>
<div class="d-grid gap-2" data-filter-search-control>
<label class="form-label fw-semibold" for="directory-search">Search</label>
<input id="directory-search" class="form-control" type="search" placeholder="Search titles, regions, types, languages, periods" data-entry-filter data-filter-search>
</div>
<div class="d-grid gap-2">
<label class="form-label fw-semibold" for="directory-section">Section</label>
<select id="directory-section" class="form-select" data-entry-filter data-filter-section>
<option value="">All sections</option>
<option value="archives">Archives and primary sources</option>
<option value="learning">Learning</option>
<option value="more-awesome">More Awesome</option>
</select>
</div>
<div class="d-grid gap-2">
<label class="form-label fw-semibold" for="directory-region">Region</label>
<select id="directory-region" class="form-select" data-entry-filter data-filter-region>
<option value="">All regions</option>
${optionList(
	entries.filter((entry) => entry.directory_section === 'archives'),
	'regions'
)}
</select>
</div>
<div class="d-grid gap-2">
<label class="form-label fw-semibold" for="directory-type">Type</label>
<select id="directory-type" class="form-select" data-entry-filter data-filter-type>
<option value="">All types</option>
${optionList(entries, 'resource_types')}
</select>
</div>
<div class="d-grid gap-2">
<label class="form-label fw-semibold" for="directory-language">Language</label>
<select id="directory-language" class="form-select" data-entry-filter data-filter-language>
<option value="">All languages</option>
${optionList(entries, 'languages')}
</select>
</div>
<div class="d-grid gap-2">
<label class="form-label fw-semibold" for="directory-period">Period</label>
<select id="directory-period" class="form-select" data-entry-filter data-filter-period>
<option value="">All periods</option>
${optionList(entries, 'periods')}
</select>
</div>
<div class="d-grid gap-2 align-items-end">
<label class="form-label d-none d-md-block">&nbsp;</label>
<button class="btn btn-outline-secondary w-100" type="button" aria-label="Reset all active filters" id="directory-reset" data-filter-reset>Reset filters</button>
</div>
</div>
:::
:::

<p class="text-body-secondary fw-semibold mb-4" data-result-count>${entries.length} entries</p>

<div class="d-grid gap-4" data-entry-grid>
${cards}
</div>

::: {.callout-note}
## Disclosure

This page was made using human and artificial intelligence. People selected, reviewed, corrected, and maintain the entries; AI-assisted workflows were used to support drafting, structuring, and site production.

See the [Editorial Policy](EDITORIAL_POLICY.md) for inclusion, review, and AI-use criteria.

:::
`;
}
