import fs from 'fs';
import entries from '../src/lib/data/entries.json' assert { type: 'json' };

let regions = new Set();
entries.forEach((entry) => {
	entry.region.forEach((region) => {
		regions.add(region);
	});
});
regions = Array.from(regions).sort();

const header = `# Awesome Digital History [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[<img src="android-chrome-512x512.png" align="right" width="100">](https://maehr.github.io/awesome-digital-history/)

> Find primary sources online and learn how to research history digitally.

Finding aids for textual and multimedia [primary sources](https://en.wikipedia.org/wiki/Primary_source) with a focus on the western hemisphere and the 19th and 20th centuries. Courses and learning tools to explore history digitally.

Check out our new website at [awesome-digital-history.pages.dev](https://awesome-digital-history.pages.dev/) with more information, filters, and a search function.
`;

let toc = `## Contents

- [Archives and primary sources](#archives-and-primary-sources)
`;

regions.forEach((region) => {
	toc += `  - [${region}](#${region.toString().toLowerCase().replace(/ /g, '-')})\n`;
});

toc += `- [Learning](#learning)
- [More Awesome](#more-awesome)
- [Contribute](#contribute)

`;

let sections = `## Archives and primary sources
    
`;

regions.forEach((region) => {
	sections += `### ${region}\n\n`;
	const entriesInRegion = entries.filter((entry) => entry.region.includes(region));
	entriesInRegion.forEach((entry) => {
		sections += `- [${entry.title}](${entry.url}) - ${entry.description}\n`;
	});
	sections += '\n';
});

sections += `## Learning\n\n`;
const learningMaterials = entries.filter(
	(entry) => entry.region.length === 0 && entry.type.includes('learning materials')
);
learningMaterials.forEach((entry) => {
	sections += `- [${entry.title}](${entry.url}) - ${entry.description}\n`;
});
sections += '\n';

sections += `## More Awesome\n\n`;
const moreAwesome = entries.filter(
	(entry) => entry.region.length === 0 && !entry.type.includes('learning materials')
);
moreAwesome.forEach((entry) => {
	sections += `- [${entry.title}](${entry.url}) - ${entry.description}\n`;
});
sections += '\n';

const footer = `## Contribute

Contributions welcome! Read the [CONTRIBUTING.md](https://github.com/maehr/awesome-digital-history/blob/main/CONTRIBUTING.md) first.

`;

fs.writeFile('./README.md', header + toc + sections + footer, (err) => {
	if (err) throw err;
	console.log(`README.md has been created.`);
});
