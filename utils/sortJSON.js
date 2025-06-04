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
		const updatedData = jsonData.map((entry) => {
			const defaultStructure = {
				title: '',
				description: '',
				url: '',
				region: [],
				language: [],
				type: [],
				period: []
			};

			return { ...defaultStructure, ...entry };
		});

		// Sort the JSON array by the "title" field
		updatedData.sort((a, b) => a.title.localeCompare(b.title));

		// Write the sorted and amended JSON data back to the file
		try {
			const jsonString = JSON.stringify(updatedData, null, 2);
			fs.writeFile(filepath, jsonString, (err) => {
				if (err) {
					console.error(`Error writing file: ${err.message}`);
					return;
				}
				console.log(`File "${filepath}" sorted and structured successfully.`);
			});
		} catch (error) {
			console.error(`Error stringifying JSON data: ${error.message}`);
		}
	} catch (error) {
		console.error(`Error parsing JSON data: ${error.message}`);
	}
});
