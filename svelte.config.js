import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ precompress: true }),
		csp: {
			directives: {
				'script-src': ['self', '*.plausible.io']
			}
		}
	},
	preprocess: vitePreprocess()
};

export default config;
