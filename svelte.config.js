import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	kit: {
		adapter: adapter({ precompress: true }),
		csp: { mode: 'auto' }
	},
	preprocess: [mdsvex(mdsvexConfig), vitePreprocess()]
};

export default config;
