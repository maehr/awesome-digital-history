import relativeImages from 'mdsvex-relative-images';
import autolinkHeadings from 'rehype-autolink-headings';

const config = {
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		dashes: 'oldschool'
	},

	remarkPlugins: [relativeImages],
	rehypePlugins: [
		[
			autolinkHeadings,
			{
				behavior: 'wrap'
			}
		]
	]
};

export default config;
