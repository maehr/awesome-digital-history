import { describe, it, expect } from 'vitest';
import appHtml from './app.html?raw';

describe('app shell', () => {
	it('does not include the Plausible analytics script', () => {
		expect(appHtml).not.toContain('plausible.io');
		expect(appHtml).not.toContain('data-domain=');
	});
});
