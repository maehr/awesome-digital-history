import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from '../routes/data.json/+server.js';

describe('GET /data.json', () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it('returns mapped GitHub metadata when both API responses are valid', async () => {
		vi.stubGlobal(
			'fetch',
			vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					json: async () => [
						{
							login: 'octocat',
							avatar_url: 'https://avatars.example/octocat.png',
							html_url: 'https://github.com/octocat'
						}
					]
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => [
						{
							html_url: 'https://github.com/maehr/awesome-digital-history/commit/123',
							commit: {
								author: {
									date: '2026-03-22T00:00:00.000Z'
								}
							}
						}
					]
				})
		);

		const response = await GET();

		await expect(response.json()).resolves.toEqual({
			contributors: [
				{
					login: 'octocat',
					avatar_url: 'https://avatars.example/octocat.png',
					html_url: 'https://github.com/octocat'
				}
			],
			latest_commit: {
				html_url: 'https://github.com/maehr/awesome-digital-history/commit/123',
				date: '2026-03-22T00:00:00.000Z'
			}
		});
	});

	it('falls back to empty metadata when GitHub data is blocked or malformed', async () => {
		vi.stubGlobal(
			'fetch',
			vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					json: async () => {
						throw new SyntaxError("Unexpected token 'B'");
					}
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({ message: 'API rate limit exceeded' })
				})
		);

		const response = await GET();

		await expect(response.json()).resolves.toEqual({
			contributors: [],
			latest_commit: null
		});
	});
});
