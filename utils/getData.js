import fs from 'fs';
import fetch from 'node-fetch';

async function getData(url, filepath) {
	await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
				if (err) {
					console.error(`Error writing file: ${err.message}`);
					return;
				}
				console.log(`File "${filepath}" written successfully.`);
			});
		})
		.catch((error) => console.error(error));
}

const data = [
	{
		url: `https://api.github.com/repos/maehr/awesome-digital-history/contributors`,
		filepath: 'src/lib/data/contributors.json'
	},
	{
		url: `https://api.github.com/repos/maehr/awesome-digital-history/commits?per_page=1&status=success`,
		filepath: 'src/lib/data/latest_commit.json'
	}
];

for (const item of data) {
	getData(item.url, item.filepath);
}
