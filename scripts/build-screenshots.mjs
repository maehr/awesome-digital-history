import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { ROOT_DIR, SCREENSHOT_DIR, loadEntries } from './lib/entries.mjs';

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const concurrency = Number(process.env.SCREENSHOT_CONCURRENCY || 3);
const slugArgIndex = process.argv.indexOf('--slug');
const slugFilter =
	slugArgIndex !== -1 && process.argv[slugArgIndex + 1]
		? new Set(
				process.argv[slugArgIndex + 1]
					.split(',')
					.map((value) => value.trim())
					.filter(Boolean)
			)
		: null;

await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

const entries = await loadEntries();
const queue = [];

for (const entry of entries) {
	if (slugFilter && !slugFilter.has(entry.slug)) {
		continue;
	}

	const screenshotPath = path.join(ROOT_DIR, entry.screenshot.replace(/^\//, ''));
	const exists = await fs
		.access(screenshotPath)
		.then(() => true)
		.catch(() => false);

	if (force || !exists) {
		queue.push({ entry, screenshotPath });
	}
}

if (queue.length === 0) {
	console.log('All screenshots already exist.');
	process.exit(0);
}

const attemptedCount = queue.length;

async function runCapture(item) {
	const command = [
		'scripts/screenshot-clean.mjs',
		item.entry.external_url,
		item.screenshotPath,
		'--wait-ms',
		String(item.entry.screenshot_wait_ms || 6000)
	];

	if (item.entry.screenshot_full_page) {
		command.push('--full-page');
	}

	if (item.entry.screenshot_hide.length > 0) {
		command.push('--hide', item.entry.screenshot_hide.join(','));
	}

	await new Promise((resolve, reject) => {
		const child = spawn(process.execPath, command, {
			cwd: ROOT_DIR,
			stdio: 'inherit'
		});
		child.on('exit', (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error(`Screenshot failed for ${item.entry.slug}`));
		});
	});
}

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

async function writePlaceholder(item, reason) {
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
	const hostname = (() => {
		try {
			return new URL(item.entry.external_url).hostname;
		} catch {
			return item.entry.external_url;
		}
	})();

	const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
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
      h1 {
        margin: 20px 0 14px;
        font-size: 54px;
        line-height: 1.05;
      }
      p {
        margin: 0;
        font-size: 24px;
        line-height: 1.45;
        color: #334155;
      }
      .meta {
        margin-top: 28px;
        display: grid;
        gap: 10px;
        color: #475569;
        font-size: 19px;
      }
      .reason {
        color: #64748b;
      }
    </style>
  </head>
  <body>
    <main>
      <div class="eyebrow">Placeholder screenshot</div>
      <h1>${escapeHtml(item.entry.title)}</h1>
      <p>${escapeHtml(item.entry.short_description)}</p>
      <div class="meta">
        <div><strong>Source:</strong> ${escapeHtml(hostname)}</div>
        <div class="reason"><strong>Reason:</strong> ${escapeHtml(reason)}</div>
      </div>
    </main>
  </body>
</html>`;

	try {
		await page.setContent(html, { waitUntil: 'load' });
		await page.screenshot({ path: item.screenshotPath, type: 'png' });
	} finally {
		await page.close();
		await browser.close();
	}
}

const placeholders = [];

const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
	while (queue.length > 0) {
		const item = queue.shift();
		if (!item) {
			return;
		}
		try {
			await runCapture(item);
		} catch (error) {
			await writePlaceholder(item, error.message);
			placeholders.push({ slug: item.entry.slug, reason: error.message });
			console.warn(`Used placeholder screenshot for ${item.entry.slug}`);
		}
	}
});

await Promise.all(workers);
if (placeholders.length > 0) {
	console.warn(`Placeholder screenshots used: ${placeholders.length}`);
	for (const placeholder of placeholders) {
		console.warn(`- ${placeholder.slug}: ${placeholder.reason}`);
	}
}

console.log(`Captured or attempted ${attemptedCount} screenshots.`);
