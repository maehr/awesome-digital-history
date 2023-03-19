import fs from 'fs/promises';
import fetch from 'node-fetch';

async function getData(url, filepath) {
	try {
		const response = await fetch(url);
		const data = await response.json();
		await fs.writeFile(filepath, JSON.stringify(data, null, 2));
		console.log(`File "${filepath}" written successfully.`);
	} catch (err) {
		console.error(`Error writing file: ${err.message}`);
	}
}

const data = [
	{
		url: 'https://api.github.com/repos/maehr/awesome-digital-history/contributors',
		filepath: 'src/lib/data/contributors.json'
	},
	{
		url: 'https://api.github.com/repos/maehr/awesome-digital-history/commits?per_page=1&status=success',
		filepath: 'src/lib/data/latest_commit.json'
	}
];

(async function () {
	for (const item of data) {
		await getData(item.url, item.filepath);
	}
})();
