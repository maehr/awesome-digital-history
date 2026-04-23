#!/usr/bin/env node

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const DEFAULT_WAIT_MS = 6000;
const DEFAULT_TIMEOUT_MS = 45000;
const DEFAULT_WIDTH = 1600;
const DEFAULT_HEIGHT = 900;

const COOKIE_TEXTS = [
	'accept',
	'accept all',
	'accept all cookies',
	'agree',
	'allow all',
	'yes, i agree',
	'alle akzeptieren',
	'akzeptieren',
	'einverstanden',
	'zustimmen',
	'tout accepter',
	'accepter',
	"j'accepte",
	'j accepte',
	'autoriser'
];

const REJECT_TEXTS = [
	'reject',
	'reject all',
	'only necessary',
	'necessary only',
	'decline',
	'refuse',
	'deny',
	'save preferences',
	'alle ablehnen',
	'ablehnen',
	'nur notwendige',
	'tout refuser',
	'refuser',
	'uniquement necessaires',
	'uniquement nécessaires',
	'enregistrer'
];

const OVERLAY_SELECTORS = [
	'#onetrust-banner-sdk',
	'#onetrust-consent-sdk',
	'.onetrust-pc-dark-filter',
	'#CybotCookiebotDialog',
	'#CookiebotWidget',
	'#cookie-law-info-bar',
	'.cookie-banner',
	'.cookies-banner',
	'.cookie-consent',
	'.cookie-consent-banner',
	'.cc-window',
	'.qc-cmp2-container',
	'.qc-cmp2-ui',
	'.osano-cm-window',
	'.osano-cm-dialog',
	"[id*='cookie']",
	"[class*='cookie']",
	"[id*='consent']",
	"[class*='consent']",
	"[data-nosnippet='true']",
	'.modal-backdrop',
	'.overlay',
	'.newsletter-popup'
];

const CONSENT_CONTAINER_SELECTORS = [
	'#onetrust-consent-sdk',
	'#onetrust-banner-sdk',
	'#CybotCookiebotDialog',
	'.qc-cmp2-container',
	'.qc-cmp2-ui',
	'.osano-cm-window',
	'.osano-cm-dialog',
	"[id*='cookie']",
	"[class*='cookie']",
	"[id*='consent']",
	"[class*='consent']",
	"[data-testid*='consent']",
	"[data-testid*='cookie']",
	"[aria-label*='cookie']",
	"[aria-label*='consent']"
];

function parseViewport(viewportValue) {
	const match = /^(\d+)x(\d+)$/.exec(viewportValue);
	if (!match) {
		throw new Error(`Invalid --viewport value '${viewportValue}'. Use <width>x<height>.`);
	}
	return { width: Number(match[1]), height: Number(match[2]) };
}

function parseArgs(rawArgs) {
	const args = {
		hide: [],
		timeoutMs: DEFAULT_TIMEOUT_MS,
		waitMs: DEFAULT_WAIT_MS,
		viewport: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }
	};

	const positionals = [];
	for (let index = 0; index < rawArgs.length; index += 1) {
		const token = rawArgs[index];
		if (!token.startsWith('--')) {
			positionals.push(token);
			continue;
		}

		const [key, inlineValue] = token.split('=', 2);
		const nextValue = inlineValue ?? rawArgs[index + 1];

		if (key === '--wait-ms') {
			args.waitMs = Number(nextValue);
			if (!inlineValue) {
				index += 1;
			}
			continue;
		}

		if (key === '--timeout-ms') {
			args.timeoutMs = Number(nextValue);
			if (!inlineValue) {
				index += 1;
			}
			continue;
		}

		if (key === '--viewport') {
			args.viewport = parseViewport(nextValue);
			if (!inlineValue) {
				index += 1;
			}
			continue;
		}

		if (key === '--hide') {
			args.hide.push(
				...nextValue
					.split(',')
					.map((selector) => selector.trim())
					.filter(Boolean)
			);
			if (!inlineValue) {
				index += 1;
			}
			continue;
		}

		if (key === '--full-page') {
			args.fullPage = true;
			continue;
		}

		if (key === '--help') {
			args.help = true;
			continue;
		}

		throw new Error(`Unknown option '${token}'.`);
	}

	args.url = positionals[0];
	args.output = positionals[1];
	return args;
}

function printHelp() {
	process.stdout.write(`Usage:\n  npm run screenshots -- <url> <output-file> [options]\n`);
}

function isBlockedPageText(text) {
	const value = String(text || '').toLowerCase();
	const patterns = [
		/performing security verification/,
		/verify you are human/,
		/let'?s confirm you are human/,
		/sorry,? you have been blocked/,
		/response code 403/,
		/403 error/,
		/403 forbidden/,
		/404 not found/,
		/request could not be satisfied/,
		/access denied/,
		/you don't have permission to access this resource/,
		/protected by anubis/,
		/performance and security by cloudflare/
	];

	return patterns.some((pattern) => pattern.test(value));
}

async function tryClickConsentByText(page, texts) {
	return page.evaluate((candidates) => {
		const normalise = (value) =>
			(value || '')
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/\s+/g, ' ')
				.trim();

		const wanted = new Set(candidates.map((text) => normalise(text)));
		const roots = new Set();
		for (const selector of [
			'#onetrust-consent-sdk',
			'#onetrust-banner-sdk',
			'#CybotCookiebotDialog',
			'.qc-cmp2-container',
			'.qc-cmp2-ui',
			'.osano-cm-window',
			'.osano-cm-dialog',
			"[id*='cookie']",
			"[class*='cookie']",
			"[id*='consent']",
			"[class*='consent']",
			"[data-testid*='consent']",
			"[data-testid*='cookie']",
			"[aria-label*='cookie']",
			"[aria-label*='consent']"
		]) {
			for (const element of document.querySelectorAll(selector)) {
				roots.add(element);
			}
		}

		const nodes = [];
		for (const root of roots) {
			for (const node of root.querySelectorAll(
				"button, a[role='button'], [role='button'], input[type='button'], input[type='submit']"
			)) {
				nodes.push(node);
			}
		}

		const extractText = (element) => {
			if (element instanceof HTMLInputElement) {
				return element.value || '';
			}
			return element.textContent || '';
		};

		for (const node of nodes) {
			const text = normalise(extractText(node));
			if (!text) {
				continue;
			}
			for (const candidate of wanted) {
				if (text === candidate || text.includes(candidate)) {
					node.click();
					return text;
				}
			}
		}

		return '';
	}, texts);
}

async function waitForImagesToLoad(page, timeoutMs) {
	const maxWaitMs = Math.min(timeoutMs, 12000);
	const start = Date.now();

	while (Date.now() - start < maxWaitMs) {
		const status = await page.evaluate(() => {
			const styleVisible = (element) => {
				const style = window.getComputedStyle(element);
				if (
					style.display === 'none' ||
					style.visibility === 'hidden' ||
					Number(style.opacity) === 0
				) {
					return false;
				}
				const rect = element.getBoundingClientRect();
				return rect.width > 2 && rect.height > 2;
			};

			const images = Array.from(document.querySelectorAll('img')).filter(styleVisible);
			let pending = 0;
			for (const image of images) {
				if (!image.complete || image.naturalWidth === 0) {
					pending += 1;
				}
			}
			return { visibleCount: images.length, pendingCount: pending };
		});

		if (status.visibleCount === 0 || status.pendingCount === 0) {
			return;
		}

		await page.waitForTimeout(250);
	}
}

async function hideOverlays(page, customSelectors) {
	const selectors = [...OVERLAY_SELECTORS, ...CONSENT_CONTAINER_SELECTORS, ...customSelectors];

	await page
		.addStyleTag({
			content: [
				'* { animation: none !important; transition: none !important; }',
				`${selectors.join(',')} { display: none !important; visibility: hidden !important; opacity: 0 !important; }`,
				'html, body { overflow: auto !important; }'
			].join('\n')
		})
		.catch(() => null);

	await page.evaluate((selectorList) => {
		const removeElement = (element) => {
			element.style.setProperty('display', 'none', 'important');
			element.style.setProperty('visibility', 'hidden', 'important');
			element.style.setProperty('opacity', '0', 'important');
			element.setAttribute('aria-hidden', 'true');
		};

		for (const selector of selectorList) {
			for (const element of document.querySelectorAll(selector)) {
				removeElement(element);
			}
		}
	}, selectors);
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	if (args.help || !args.url || !args.output) {
		printHelp();
		process.exit(args.help ? 0 : 1);
	}

	const outputDir = path.dirname(args.output);
	await mkdir(outputDir, { recursive: true });

	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({ viewport: args.viewport, ignoreHTTPSErrors: true });
	const page = await context.newPage();

	try {
		const response = await page.goto(args.url, {
			waitUntil: 'domcontentloaded',
			timeout: args.timeoutMs
		});
		const status = response?.status();
		if (typeof status === 'number' && status >= 400) {
			throw new Error(`HTTP ${status}`);
		}

		await page.waitForLoadState('networkidle', { timeout: args.timeoutMs }).catch(() => null);
		await tryClickConsentByText(page, REJECT_TEXTS);
		await page.waitForTimeout(400);
		await tryClickConsentByText(page, COOKIE_TEXTS);
		await page.waitForTimeout(400);
		await waitForImagesToLoad(page, args.timeoutMs);
		await hideOverlays(page, args.hide);
		await page.waitForTimeout(args.waitMs);

		const bodyText = await page.evaluate(() => document.body?.innerText || '');
		if (isBlockedPageText(bodyText)) {
			throw new Error('Blocked or error page detected');
		}

		await page.screenshot({
			path: args.output,
			fullPage: Boolean(args.fullPage),
			type: 'png'
		});

		process.stdout.write(`Saved screenshot: ${args.output}\n`);
	} finally {
		await context.close();
		await browser.close();
	}
}

main().catch((error) => {
	process.stderr.write(`Screenshot failed: ${error.message}\n`);
	process.exit(1);
});
