---
name: Change request
about: Request to change an item from the list
title: '[Change]'
labels: 'awesome'
assignees: ''
---

**Item Details**

Please provide the following details about the item you want to change:

- old entry

```json
{
	"title": "",
	"description": "",
	"url": "",
	"region": [],
	"language": [],
	"type": [],
	"period": []
}
```

- new entry

```json
{
	"title": "",
	"description": "",
	"url": "",
	"region": [],
	"language": [],
	"type": [],
	"period": []
}
```

Use `data/entries.json` as the canonical reference for existing values.

Allowed values:

- `region`: `Africa`, `Asia`, `Austria`, `Europe`, `France`, `Germany`, `Global`, `Great Britain`, `Netherlands`, `North America`, `Switzerland`
- `language`: lowercase ISO-style codes already present in `data/entries.json`
- `type`: `audiovisual sources`, `books`, `collection`, `encyclopedias`, `learning materials`, `magazines`, `manuscripts`, `maps`, `newspapers`, `photos`, `portal`, `primary sources`, `search engine`, `sheet music`, `statistics`, `tools`, `websites`
- `period`: `prehistory`, `ancient`, `classical`, `medieval`, `early modern`, `modern`, `contemporary`

**Item to be changed**

Please provide the title of the item you wish to change and a link to it, if applicable.

**Reason for change(s)**

Briefly explain why you believe this item should be changed.

**Proposal for change(s)**

Please provide / suggest the updated values.

**Additional context**

Add any other context or screenshots about the change request here.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.
