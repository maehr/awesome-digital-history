import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ precompress: true }),
		csp: {
			directives: {
				'default-src': ['self'],
				'script-src': ['plausible.io'],
				'connect-src': ['plausible.io']
			}
		}
	},
	preprocess: vitePreprocess()
};

export default config;
