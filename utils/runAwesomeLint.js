import awesomeLint from 'awesome-lint/index.js';

await awesomeLint.report({
	filename: 'README.md',
	repoURL: 'https://github.com/maehr/awesome-digital-history'
});
