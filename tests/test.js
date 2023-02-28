import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toBe('Awesome Digital History');
});

test('some interaction', async ({ page }) => {
	await page.goto('/');
	await page.getByPlaceholder('Search by title or description').click();
	await page.getByPlaceholder('Search by title or description').fill('swiss');
	await page.getByRole('heading', { name: 'Amtsdruckschriften' }).click();
	await page.getByRole('button', { name: 'Reset' }).click();
	await page.getByRole('heading', { name: 'Ad*Access' }).click();
});
