// Capture a screenshot for each entry that has none.
// Options: --force (recapture existing), --slug a,b (only these entries).
// Env: SCREENSHOT_CONCURRENCY (default 3).
// Entries can set `screenshot_hide: [css selectors]` to hide page elements.
// A failed capture writes a placeholder image instead.

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';
import { ROOT_DIR, SCREENSHOT_DIR, loadEntries } from './lib/entries.mjs';

const VIEWPORT = { width: 1600, height: 900 };
const TIMEOUT_MS = 45000;
const SETTLE_MS = 6000;
const USER_AGENT =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const ACCEPT_TEXTS = [
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

const CONSENT_SELECTORS = [
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

const OVERLAY_SELECTORS = [
	...CONSENT_SELECTORS,
	'.onetrust-pc-dark-filter',
	'#CookiebotWidget',
	'#cookie-law-info-bar',
	'.cookie-banner',
	'.cookies-banner',
	'.cookie-consent',
	'.cookie-consent-banner',
	'.cc-window',
	"[data-nosnippet='true']",
	'.modal-backdrop',
	'.overlay',
	'.newsletter-popup'
];

const BLOCKED_PAGE_PATTERNS = [
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

// Click the first consent button whose label contains one of `texts`.
function clickConsentButton(page, texts) {
	return page.evaluate(
		({ texts, selectors }) => {
			const normalise = (value) =>
				(value || '')
					.toLowerCase()
					.normalize('NFD')
					.replace(/[̀-ͯ]/g, '')
					.replace(/\s+/g, ' ')
					.trim();
			const wanted = texts.map(normalise);
			const buttons = document.querySelectorAll(
				selectors
					.flatMap((root) =>
						[
							'button',
							"a[role='button']",
							"[role='button']",
							"input[type='button']",
							"input[type='submit']"
						].map((button) => `${root} ${button}`)
					)
					.join(',')
			);
			for (const button of buttons) {
				const text = normalise(
					button instanceof HTMLInputElement ? button.value : button.textContent
				);
				if (text && wanted.some((candidate) => text.includes(candidate))) {
					button.click();
					return;
				}
			}
		},
		{ texts, selectors: CONSENT_SELECTORS }
	);
}

async function waitForVisibleImages(page) {
	const deadline = Date.now() + 12000;
	while (Date.now() < deadline) {
		const pending = await page.evaluate(
			() =>
				Array.from(document.querySelectorAll('img')).filter((image) => {
					const style = window.getComputedStyle(image);
					const rect = image.getBoundingClientRect();
					const visible =
						style.display !== 'none' &&
						style.visibility !== 'hidden' &&
						Number(style.opacity) !== 0 &&
						rect.width > 2 &&
						rect.height > 2;
					return visible && (!image.complete || image.naturalWidth === 0);
				}).length
		);
		if (pending === 0) {
			return;
		}
		await page.waitForTimeout(250);
	}
}

async function hideOverlays(page, extraSelectors) {
	const selectors = [...OVERLAY_SELECTORS, ...extraSelectors].join(',');
	await page
		.addStyleTag({
			content: [
				'* { animation: none !important; transition: none !important; }',
				`${selectors} { display: none !important; visibility: hidden !important; opacity: 0 !important; }`,
				'html, body { overflow: auto !important; }'
			].join('\n')
		})
		.catch(() => null);
	// Inline styles still work when the page's CSP blocks the style tag.
	await page.evaluate((selectorList) => {
		for (const element of document.querySelectorAll(selectorList)) {
			element.style.setProperty('display', 'none', 'important');
			element.style.setProperty('visibility', 'hidden', 'important');
			element.style.setProperty('opacity', '0', 'important');
			element.setAttribute('aria-hidden', 'true');
		}
	}, selectors);
}

async function capture(browser, entry, outputPath) {
	const context = await browser.newContext({
		viewport: VIEWPORT,
		ignoreHTTPSErrors: true,
		userAgent: USER_AGENT
	});
	try {
		const page = await context.newPage();
		const response = await page.goto(entry.external_url, {
			waitUntil: 'domcontentloaded',
			timeout: TIMEOUT_MS
		});
		if (response && response.status() >= 400) {
			throw new Error(`HTTP ${response.status()}`);
		}
		await page.waitForLoadState('networkidle', { timeout: TIMEOUT_MS }).catch(() => null);
		await clickConsentButton(page, REJECT_TEXTS);
		await page.waitForTimeout(400);
		await clickConsentButton(page, ACCEPT_TEXTS);
		await page.waitForTimeout(400);
		await waitForVisibleImages(page);
		await hideOverlays(page, entry.screenshot_hide);
		await page.waitForTimeout(SETTLE_MS);

		const bodyText = (await page.evaluate(() => document.body?.innerText || '')).toLowerCase();
		if (BLOCKED_PAGE_PATTERNS.some((pattern) => pattern.test(bodyText))) {
			throw new Error('Blocked or error page detected');
		}
		await page.screenshot({ path: outputPath, type: 'png' });
		console.log(`Saved screenshot: ${path.relative(ROOT_DIR, outputPath)}`);
	} finally {
		await context.close();
	}
}

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

async function writePlaceholder(browser, entry, outputPath, reason) {
	let hostname = entry.external_url;
	try {
		hostname = new URL(entry.external_url).hostname;
	} catch {
		// Keep the raw URL.
	}

	const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 55%, #e2e8f0 100%);
        color: #0f172a;
      }
      main {
        width: min(1080px, calc(100vw - 96px));
        padding: 48px;
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 30px 80px rgba(15, 23, 42, 0.16);
        border: 1px solid rgba(148, 163, 184, 0.25);
      }
      .eyebrow {
        display: inline-flex;
        padding: 8px 14px;
        border-radius: 999px;
        background: #dbeafe;
        color: #1d4ed8;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      h1 { margin: 20px 0 14px; font-size: 54px; line-height: 1.05; }
      p { margin: 0; font-size: 24px; line-height: 1.45; color: #334155; }
      .meta { margin-top: 28px; display: grid; gap: 10px; color: #475569; font-size: 19px; }
      .reason { color: #64748b; }
    </style>
  </head>
  <body>
    <main>
      <div class="eyebrow">Placeholder screenshot</div>
      <h1>${escapeHtml(entry.title)}</h1>
      <p>${escapeHtml(entry.short_description)}</p>
      <div class="meta">
        <div><strong>Source:</strong> ${escapeHtml(hostname)}</div>
        <div class="reason"><strong>Reason:</strong> ${escapeHtml(reason)}</div>
      </div>
    </main>
  </body>
</html>`;

	const page = await browser.newPage({ viewport: VIEWPORT });
	try {
		await page.setContent(html, { waitUntil: 'load' });
		await page.screenshot({ path: outputPath, type: 'png' });
	} finally {
		await page.close();
	}
}

async function exists(filePath) {
	return fs
		.access(filePath)
		.then(() => true)
		.catch(() => false);
}

const argv = process.argv.slice(2);
const force = argv.includes('--force');
const slugIndex = argv.indexOf('--slug');
const slugs =
	slugIndex === -1 ? null : new Set((argv[slugIndex + 1] ?? '').split(',').filter(Boolean));
const concurrency = Number(process.env.SCREENSHOT_CONCURRENCY || 3);

await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

const queue = [];
for (const entry of await loadEntries()) {
	if (slugs && !slugs.has(entry.slug)) {
		continue;
	}
	const outputPath = path.join(ROOT_DIR, entry.screenshot.replace(/^\//, ''));
	if (force || !(await exists(outputPath))) {
		queue.push({ entry, outputPath });
	}
}

if (queue.length === 0) {
	console.log('All screenshots already exist.');
	process.exit(0);
}

const attempted = queue.length;
const placeholders = [];
// Headed mode: some sites block headless browsers.
const browser = await chromium.launch({ headless: false });

try {
	const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
		for (let item = queue.shift(); item; item = queue.shift()) {
			try {
				await capture(browser, item.entry, item.outputPath);
			} catch (error) {
				await writePlaceholder(browser, item.entry, item.outputPath, error.message);
				placeholders.push(`- ${item.entry.slug}: ${error.message}`);
				console.warn(`Used placeholder screenshot for ${item.entry.slug}`);
			}
		}
	});
	await Promise.all(workers);
} finally {
	await browser.close();
}

if (placeholders.length > 0) {
	console.warn(`Placeholder screenshots used: ${placeholders.length}`);
	console.warn(placeholders.join('\n'));
}
console.log(`Captured or attempted ${attempted} screenshots.`);
