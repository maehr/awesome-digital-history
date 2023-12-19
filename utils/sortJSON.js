import fs from 'fs';

const filepath = 'src/lib/data/entries.json';

fs.readFile(filepath, 'utf-8', (err, data) => {
	if (err) {
		console.error(`Error reading file: ${err.message}`);
		return;
	}

	try {
		const jsonData = JSON.parse(data);

		// Ensure all entries have the required structure
		jsonData.forEach((entry) => {
			const defaultStructure = {
				title: '',
				description: '',
				url: '',
				region: [],
				language: [],
				type: [],
				period: []
			};

			Object.assign(defaultStructure, entry);
			return defaultStructure;
		});

		// Sort the JSON array by the "title" field
		jsonData.sort((a, b) => a.title.localeCompare(b.title));

		// Write the sorted and amended JSON data back to the file
		fs.writeFile(filepath, JSON.stringify(jsonData, null, 2), (err) => {
			if (err) {
				console.error(`Error writing file: ${err.message}`);
				return;
			}
			console.log(`File "${filepath}" sorted and structured successfully.`);
		});
	} catch (error) {
		console.error(`Error parsing JSON data: ${error.message}`);
	}
});
