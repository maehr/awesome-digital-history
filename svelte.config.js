import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	kit: {
		adapter: adapter({ precompress: true }),
		csp: { mode: 'auto' },
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/awesome-digital-history' : ''
		}
	},
	preprocess: [mdsvex(mdsvexConfig), vitePreprocess()]
};

export default config;
