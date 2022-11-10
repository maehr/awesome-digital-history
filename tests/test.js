import { expect, test } from '@playwright/test';

test('index page has expected h3', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h3')).toBe('Awesome Digital History');
});
