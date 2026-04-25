import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
	buildEntryPage,
	extractNarrativeBody,
	loadEntries,
	normalizeDateField,
	todayIsoDate
} from './lib/entries.mjs';

const execFileAsync = promisify(execFile);
const HISTORY_PATHS = ['README.md', 'src/lib/data/entries.json', 'data/entries.json'];

async function git(args) {
	const { stdout } = await execFileAsync('git', args, { maxBuffer: 1024 * 1024 * 50 });
	return stdout;
}

function normalizeTitle(value) {
	return String(value || '')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()
		.replace(/\s+/g, ' ');
}

function normalizeUrl(value) {
	const raw = String(value || '').trim();
	if (!raw) {
		return '';
	}

	try {
		const parsed = new URL(raw);
		const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
		const pathname = parsed.pathname.replace(/\/+$/, '');
		return `${host}${pathname}${parsed.search}`.toLowerCase();
	} catch {
		return raw
			.toLowerCase()
			.replace(/^https?:\/\//, '')
			.replace(/^www\./, '')
			.replace(/#.*$/, '')
			.replace(/\/+$/, '');
	}
}

function normalizeAuthor(name, email) {
	const raw = `${name || ''} ${email || ''}`.toLowerCase();

	if (raw.includes('copilot')) {
		return 'Copilot';
	}
	if (raw.includes('moritz mähr') || raw.includes('moritz maehr') || raw.includes('maehr@')) {
		return 'Moritz Mähr';
	}
	if (raw.includes('mtwente') || raw.includes('moritz twente')) {
		return 'Moritz Twente';
	}
	if (raw.includes('dominicweber')) {
		return 'Dominic Weber';
	}
	if (raw.includes('kieranrobson')) {
		return 'Kieran Robson';
	}

	return String(name || email || '').trim();
}

function uniqueValues(values) {
	return [...new Set(values.filter(Boolean))];
}

function parseReadmeRecords(raw) {
	return raw
		.split('\n')
		.map((line) => {
			const match = /^\s*[-*]\s+\[([^\]]+)\]\(([^)]+)\)\s*(?:[-–:]\s*)?(.*)$/.exec(line);
			if (!match) {
				return null;
			}
			return {
				title: match[1].trim(),
				url: match[2].trim(),
				description: match[3].trim(),
				source: 'README.md'
			};
		})
		.filter(Boolean);
}

function parseJsonRecords(raw, source) {
	try {
		const records = JSON.parse(raw);
		if (!Array.isArray(records)) {
			return [];
		}
		return records.map((record) => ({
			title: record.title,
			url: record.url ?? record.external_url,
			description: record.description ?? record.short_description ?? '',
			region: record.region ?? record.regions ?? [],
			language: record.language ?? record.languages ?? [],
			type: record.type ?? record.resource_types ?? [],
			period: record.period ?? record.periods ?? [],
			source
		}));
	} catch {
		return [];
	}
}

async function showFile(commit, filePath) {
	try {
		return await git(['show', `${commit}:${filePath}`]);
	} catch {
		return '';
	}
}

function recordFingerprint(record) {
	return JSON.stringify({
		title: record.title ?? '',
		url: normalizeUrl(record.url),
		description: record.description ?? '',
		region: record.region ?? [],
		language: record.language ?? [],
		type: record.type ?? [],
		period: record.period ?? []
	});
}

async function recordsForCommit(commit) {
	const records = [];
	const readme = await showFile(commit, 'README.md');
	if (readme) {
		records.push(...parseReadmeRecords(readme));
	}

	for (const source of ['src/lib/data/entries.json', 'data/entries.json']) {
		const raw = await showFile(commit, source);
		if (raw) {
			records.push(...parseJsonRecords(raw, source));
		}
	}

	return records;
}

async function historyCommits() {
	const output = await git([
		'log',
		'--first-parent',
		'--reverse',
		'--format=%H%x1f%ad%x1f%an%x1f%ae',
		'--date=short',
		'--',
		...HISTORY_PATHS
	]);

	return output
		.trim()
		.split('\n')
		.filter(Boolean)
		.map((line) => {
			const [hash, date, authorName, authorEmail] = line.split('\x1f');
			return {
				hash,
				date,
				author: normalizeAuthor(authorName, authorEmail)
			};
		});
}

async function inferProvenance(entries) {
	const byTitle = new Map();
	const byUrl = new Map();
	const states = new Map();

	for (const entry of entries) {
		byTitle.set(normalizeTitle(entry.title), entry);
		byUrl.set(normalizeUrl(entry.external_url), entry);
		states.set(entry.slug, {
			present: false,
			lastFingerprint: '',
			date_added: null,
			authors: new Set(),
			contributors: new Set()
		});
	}

	for (const commit of await historyCommits()) {
		const present = new Map();
		for (const record of await recordsForCommit(commit.hash)) {
			const entry =
				byUrl.get(normalizeUrl(record.url)) ?? byTitle.get(normalizeTitle(record.title));
			if (!entry) {
				continue;
			}
			const fingerprint = recordFingerprint(record);
			const current = present.get(entry.slug);
			if (!current || fingerprint.length > current.length) {
				present.set(entry.slug, fingerprint);
			}
		}

		for (const entry of entries) {
			const state = states.get(entry.slug);
			const fingerprint = present.get(entry.slug);

			if (!fingerprint) {
				state.present = false;
				state.lastFingerprint = '';
				continue;
			}

			if (!state.present) {
				state.date_added = commit.date;
				state.authors = new Set([commit.author]);
				state.contributors = new Set();
			} else if (state.lastFingerprint !== fingerprint && !state.authors.has(commit.author)) {
				state.contributors.add(commit.author);
			}

			state.present = true;
			state.lastFingerprint = fingerprint;
		}
	}

	return states;
}

async function dateAddedFromGit(filePath) {
	try {
		const stdout = await git([
			'log',
			'--follow',
			'--diff-filter=A',
			'--format=%ad',
			'--date=short',
			'--',
			filePath
		]);
		const dates = stdout.trim().split('\n').filter(Boolean);
		return dates.at(-1) ?? todayIsoDate();
	} catch {
		return todayIsoDate();
	}
}

const entries = await loadEntries();
const provenance = await inferProvenance(entries);

for (const entry of entries) {
	const body = extractNarrativeBody(entry.body);
	const inferred = provenance.get(entry.slug);
	const authors = uniqueValues([...(inferred?.authors ?? [])]);
	const contributors = uniqueValues([...(inferred?.contributors ?? [])]);
	const next = {
		...entry,
		date_added:
			normalizeDateField(inferred?.date_added) ??
			normalizeDateField(entry.date_added) ??
			(await dateAddedFromGit(entry.filePath)),
		reviewed_at: normalizeDateField(entry.reviewed_at),
		reviewed_by: entry.reviewed_by ?? [],
		authors,
		contributors
	};
	if (authors.length === 0) {
		console.warn(`Could not infer author for ${entry.filename}`);
	}
	await fs.writeFile(entry.filePath, buildEntryPage(next, body));
	console.log(`Rewrote ${entry.filename}`);
}
