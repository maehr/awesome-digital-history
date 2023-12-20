import fs from 'fs';

const filepath = 'src/lib/data/entries.json';

fs.readFile(filepath, 'utf-8', (err, data) => {
	if (err) {
		console.error(`Error reading file: ${err.message}`);
		return;
	}

	try {
		const entries = JSON.parse(data);
		const readmeContent = generateReadmeContent(entries);
		writeFile('./README.md', readmeContent);
	} catch (error) {
		console.error(`Error parsing JSON data: ${error.message}`);
	}
});

function generateReadmeContent(entries) {
	const regions = [...new Set(entries.flatMap((entry) => entry.region))].sort();

	const header = generateHeader();
	const toc = generateTableOfContents(regions);
	const sections = generateSections(entries, regions);
	const footer = generateFooter();

	return `${header}${toc}${sections}${footer}`;
}

function generateHeader() {
	return `# Awesome Digital History [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[<img src="static/favicon.png" align="right" width="100">](https://maehr.github.io/awesome-digital-history/)

> Find primary sources online and learn how to research history digitally.

Finding aids for textual and multimedia [primary sources](https://en.wikipedia.org/wiki/Primary_source) with a focus on the western hemisphere and the 19th and 20th centuries. Courses and learning tools to explore history digitally.

📢 **Announcement**

🎉 Check out our new website at [awesome-digital-history.pages.dev](https://awesome-digital-history.pages.dev/) with more information, filters, and a search function. 🎉
`;
}

function generateTableOfContents(regions) {
	let toc = `## Contents

- [Archives and primary sources](#archives-and-primary-sources)
`;

	toc += regions
		.map((region) => `  - [${region}](#${region.toLowerCase().replace(/ /g, '-')})\n`)
		.join('');
	toc += `- [Learning](#learning)
- [More Awesome](#more-awesome)
- [Contribute](#contribute)

`;

	return toc;
}

function generateSections(entries, regions) {
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

	sections += generateLearningSection(entries);
	sections += generateMoreAwesomeSection(entries);

	return sections;
}

function generateLearningSection(entries) {
	let section = `## Learning\n\n`;
	const learningMaterials = entries.filter(
		(entry) => entry.region.length === 0 && entry.type.includes('learning materials')
	);
	learningMaterials.forEach((entry) => {
		section += `- [${entry.title}](${entry.url}) - ${entry.description}\n`;
	});
	return section + '\n';
}

function generateMoreAwesomeSection(entries) {
	let section = `## More Awesome\n\n`;
	const moreAwesome = entries.filter(
		(entry) => entry.region.length === 0 && !entry.type.includes('learning materials')
	);
	moreAwesome.forEach((entry) => {
		section += `- [${entry.title}](${entry.url}) - ${entry.description}\n`;
	});
	return section + '\n';
}

function generateFooter() {
	return `## Contribute

Contributions welcome! Read the [CONTRIBUTING.md](https://github.com/maehr/awesome-digital-history/blob/main/CONTRIBUTING.md) first.

`;
}

function writeFile(filePath, content) {
	return fs.promises.writeFile(filePath, content)
		.then(() => console.log(`README.md has been created.`))
		.catch((err) => console.error(`Error writing file: ${err.message}`));
}
}
