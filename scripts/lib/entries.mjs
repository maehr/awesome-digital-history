import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

export const ROOT_DIR = process.cwd();
export const ENTRIES_DIR = path.join(ROOT_DIR, 'entries');
export const SCREENSHOT_DIR = path.join(ROOT_DIR, 'assets', 'screenshots');

export const SECTION_LABELS = {
	archives: 'Archives and primary sources',
	learning: 'Learning',
	'more-awesome': 'More Awesome'
};

export const REGION_ORDER = [
	'Africa',
	'Asia',
	'Austria',
	'Europe',
	'France',
	'Germany',
	'Global',
	'Great Britain',
	'Netherlands',
	'North America',
	'Switzerland'
];

export const ALLOWED_VALUES = {
	section: ['archives', 'learning', 'more-awesome'],
	region: REGION_ORDER,
	language: [
		'ar',
		'ca',
		'da',
		'ddn',
		'de',
		'en',
		'es',
		'fo',
		'fr',
		'ha',
		'hu',
		'is',
		'it',
		'jp',
		'kl',
		'lat',
		'lt',
		'mul',
		'nl',
		'no',
		'po',
		'pt',
		'rm',
		'ru',
		'se'
	],
	type: [
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
	period: [
		'prehistory',
		'ancient',
		'classical',
		'medieval',
		'early modern',
		'modern',
		'contemporary'
	]
};

export function slugify(value) {
	return String(value)
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, '-');
}

export function ensurePeriod(value) {
	const text = String(value || '').trim();
	if (!text) {
		return text;
	}
	return /[.!?]$/.test(text) ? text : `${text}.`;
}

export function screenshotPathForSlug(slug) {
	return `/assets/screenshots/${slug}.png`;
}

export function placeholderScreenshotPathForSlug(slug) {
	return `/assets/screenshots/${slug}-placeholder.png`;
}

export function escapeMarkdownText(value) {
	return String(value).replace(/([\\`*_[\]<>])/g, '\\$1');
}

export function classifyEntry(entry) {
	if (entry.region.length > 0) {
		return 'archives';
	}
	if (entry.type.includes('learning materials')) {
		return 'learning';
	}
	return 'more-awesome';
}

export function qmdFrontmatter(frontmatter) {
	return `---\n${yaml.dump(frontmatter, {
		lineWidth: 1000,
		noRefs: true,
		sortKeys: false
	})}---\n`;
}

export async function listEntryFiles() {
	const names = await fs.readdir(ENTRIES_DIR);
	return names
		.filter((name) => name.endsWith('.qmd'))
		.sort()
		.map((name) => path.join(ENTRIES_DIR, name));
}

export async function readEntry(filePath) {
	const raw = await fs.readFile(filePath, 'utf8');
	const parsed = matter(raw);
	const data = parsed.data;
	return {
		filePath,
		filename: path.basename(filePath),
		raw,
		body: parsed.content.trim(),
		section: data.directory_section ?? data.section ?? '',
		region: data.regions ?? data.region ?? [],
		language: data.languages ?? data.language ?? [],
		type: data.resource_types ?? data.type ?? [],
		period: data.periods ?? data.period ?? [],
		...data
	};
}

export async function loadEntries() {
	const files = await listEntryFiles();
	const entries = await Promise.all(files.map((filePath) => readEntry(filePath)));
	return entries.sort((left, right) => left.title.localeCompare(right.title));
}

export function joinValues(values) {
	return values.length > 0 ? values.join(', ') : 'None';
}

export function extractNarrativeBody(body) {
	const text = String(body || '').trim();
	const match = /## Why it matters\s+([\s\S]*?)(?:\n## Metadata\b[\s\S]*$|$)/.exec(text);
	if (match) {
		return match[1].trim();
	}
	return text;
}

export function validateEntryShape(entry) {
	const errors = [];
	const requiredStrings = [
		'title',
		'slug',
		'external_url',
		'short_description',
		'description',
		'section',
		'section_label',
		'screenshot',
		'screenshot_alt',
		'image'
	];

	for (const key of requiredStrings) {
		if (typeof entry[key] !== 'string' || entry[key].trim().length === 0) {
			errors.push(`${entry.filename}: missing ${key}`);
		}
	}

	for (const key of ['region', 'language', 'type', 'period', 'screenshot_hide']) {
		if (!Array.isArray(entry[key])) {
			errors.push(`${entry.filename}: ${key} must be an array`);
		}
	}

	if (!ALLOWED_VALUES.section.includes(entry.section)) {
		errors.push(`${entry.filename}: invalid section '${entry.section}'`);
	}

	if (entry.section_label !== SECTION_LABELS[entry.section]) {
		errors.push(`${entry.filename}: section_label must match section`);
	}

	for (const [field, allowed] of Object.entries(ALLOWED_VALUES)) {
		if (field === 'section') {
			continue;
		}
		for (const value of entry[field] || []) {
			if (!allowed.includes(value)) {
				errors.push(`${entry.filename}: invalid ${field} value '${value}'`);
			}
		}
	}

	if (entry.slug !== slugify(entry.slug)) {
		errors.push(`${entry.filename}: slug must be normalized`);
	}

	if (entry.filename !== `${entry.slug}.qmd`) {
		errors.push(`${entry.filename}: filename must match slug`);
	}

	if (!entry.external_url.startsWith('http://') && !entry.external_url.startsWith('https://')) {
		errors.push(`${entry.filename}: external_url must be absolute`);
	}

	if (entry.section === 'archives' && entry.region.length === 0) {
		errors.push(`${entry.filename}: archives entry needs a region`);
	}

	if (entry.section !== 'archives' && entry.region.length > 0) {
		errors.push(`${entry.filename}: only archives entries may define a region`);
	}

	if (entry.section === 'learning' && !entry.type.includes('learning materials')) {
		errors.push(`${entry.filename}: learning entry must include 'learning materials' type`);
	}

	if (entry.body.trim().length < 140) {
		errors.push(`${entry.filename}: body is too short`);
	}

	if (entry.body.includes('TODO:')) {
		errors.push(`${entry.filename}: body still contains TODO placeholder`);
	}

	if (entry.description.trim().length < 60 || entry.description.trim().length > 180) {
		errors.push(`${entry.filename}: description should be 60-180 characters for SEO`);
	}

	if (!entry.short_description.trim().endsWith('.')) {
		errors.push(`${entry.filename}: short_description must end with a period`);
	}

	const allowedScreenshotPaths = new Set([
		screenshotPathForSlug(entry.slug),
		placeholderScreenshotPathForSlug(entry.slug)
	]);

	if (!allowedScreenshotPaths.has(entry.screenshot)) {
		errors.push(
			`${entry.filename}: screenshot path must be ${screenshotPathForSlug(entry.slug)} or ${placeholderScreenshotPathForSlug(entry.slug)}`
		);
	}

	if (entry.image !== entry.screenshot) {
		errors.push(`${entry.filename}: image must match screenshot`);
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

		const screenshotPath = path.join(ROOT_DIR, entry.screenshot.replace(/^\//, ''));
		try {
			await fs.access(screenshotPath);
		} catch {
			errors.push(`${entry.filename}: missing screenshot '${entry.screenshot}'`);
		}
	}

	return errors;
}

export function buildReadme(entries) {
	const archives = entries.filter((entry) => entry.section === 'archives');
	const learning = entries.filter((entry) => entry.section === 'learning');
	const moreAwesome = entries.filter((entry) => entry.section === 'more-awesome');

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
		if (archives.some((entry) => entry.region.includes(region))) {
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
		const items = archives.filter((entry) => entry.region.includes(region));
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
		'Contributions welcome! Read the [CONTRIBUTING.md](https://github.com/maehr/awesome-digital-history/blob/main/CONTRIBUTING.md) first.'
	);
	lines.push('');

	return `${lines.join('\n')}\n`;
}

function cardBadges(entry) {
	const badges = [];
	badges.push(
		`<a class="badge rounded-pill bg-primary-subtle text-primary-emphasis border border-primary-subtle text-decoration-none" href="#directory-section" data-filter-chip="section" data-filter-value="${escapeHtml(entry.section)}">${escapeHtml(SECTION_LABELS[entry.section])}</a>`
	);
	for (const region of entry.region) {
		badges.push(
			`<a class="badge rounded-pill border bg-body text-body-secondary text-decoration-none" href="#directory-region" data-filter-chip="region" data-filter-value="${escapeHtml(region)}">${escapeHtml(region)}</a>`
		);
	}
	for (const type of entry.type.slice(0, 2)) {
		badges.push(
			`<a class="badge rounded-pill border bg-body text-body-secondary text-decoration-none" href="#directory-type" data-filter-chip="type" data-filter-value="${escapeHtml(type)}">${escapeHtml(type)}</a>`
		);
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
	const ordered = [...entries].sort((left, right) => left.title.localeCompare(right.title));
	const cards = ordered
		.map((entry) => {
			const searchParts = [
				entry.title,
				entry.short_description,
				entry.description,
				...entry.region,
				...entry.type,
				...entry.language,
				...entry.period
			];

			return `<article data-entry-card data-search="${escapeHtml(searchParts.join(' '))}" data-section="${escapeHtml(entry.section)}" data-region="${escapeHtml(entry.region.join('|'))}" data-type="${escapeHtml(entry.type.join('|'))}" data-language="${escapeHtml(entry.language.join('|'))}">
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
A searchable directory of digital history resources with short awesome-list descriptions, longer editorial notes, and screenshots for fast evaluation.
:::

::: {.card .bg-body-tertiary .border-0 .shadow-sm .mb-4}
::: {.card-body}
<div class="d-grid gap-3" data-filter-grid>
<div class="d-grid gap-2">
<label class="form-label fw-semibold" for="directory-search">Search</label>
<input id="directory-search" class="form-control" type="search" placeholder="Search titles, regions, types, languages" data-entry-filter data-filter-search>
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
	entries.filter((entry) => entry.section === 'archives'),
	'region'
)}
</select>
</div>
<div class="d-grid gap-2">
<label class="form-label fw-semibold" for="directory-type">Type</label>
<select id="directory-type" class="form-select" data-entry-filter data-filter-type>
<option value="">All types</option>
${optionList(entries, 'type')}
</select>
</div>
<div class="d-grid gap-2">
<label class="form-label fw-semibold" for="directory-language">Language</label>
<select id="directory-language" class="form-select" data-entry-filter data-filter-language>
<option value="">All languages</option>
${optionList(entries, 'language')}
</select>
</div>
</div>
:::
:::

<p class="text-body-secondary fw-semibold mb-4" data-result-count>${entries.length} entries</p>

<div class="d-grid gap-4" data-entry-grid>
${cards}
</div>

::: {.callout-tip}
## Notes
- The site index is pre-rendered for crawlability and randomized in the browser for visitors.
- Each entry page adds a longer description and screenshot for discovery and SEO.

:::

::: {.callout-note}
## Disclosure

This page was made using human and artificial intelligence. People selected, reviewed, corrected, and maintain the entries; AI-assisted workflows were used to support drafting, structuring, and site production.

:::
`;
}

export function buildEntryPage(entry, body) {
	const frontmatter = {
		title: entry.title,
		slug: entry.slug,
		description: entry.description,
		external_url: entry.external_url,
		short_description: ensurePeriod(entry.short_description),
		directory_section: entry.section,
		section_label: SECTION_LABELS[entry.section],
		regions: entry.region,
		languages: entry.language,
		resource_types: entry.type,
		periods: entry.period,
		screenshot: entry.screenshot,
		screenshot_alt: entry.screenshot_alt,
		screenshot_hide: entry.screenshot_hide,
		screenshot_wait_ms: entry.screenshot_wait_ms,
		screenshot_full_page: entry.screenshot_full_page,
		image: entry.screenshot,
		'page-layout': 'article',
		toc: false
	};

	return `${qmdFrontmatter(frontmatter)}
## Why it matters

${body.trim()}
`;
}
