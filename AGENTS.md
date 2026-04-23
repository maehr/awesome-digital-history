# Agents

AI agents and automation for awesome-digital-history.

## Commands

```bash
# Build artifacts
pnpm run prebuild            # Sort JSON + compile README

# Validation
pnpm run awesome-lint        # Validate README.md against Awesome List standards
pnpm run lint                # Run prettier checks

# Format
pnpm run format              # Auto-fix with prettier
```

## CI Workflows

### awesome-lint

**Trigger:** `push`, `pull_request`
**Node:** 24
**Runs:** `pnpm run awesome-lint`
**Validates:**

- List structure (headings, links, formatting)
- Alphabetical ordering within sections
- Link format: `[Title](URL) - Description. `
- Badge syntax
- ToC consistency

### Pull Request Labeler

**Trigger:** `pull_request_target`
**Auto-applies labels:**

| Label     | Files Changed                                                  |
| --------- | -------------------------------------------------------------- |
| `awesome` | `README.md`, `data/**`                                         |
| `docs`    | `.github/**`, `*.md` (except README), `utils/**`, config files |

### Stale Manager

**Trigger:** Daily cron
**Config:**

- Stale after: 60 days
- Close after: +5 days
- Labels: `no-issue-activity`, `no-pr-activity`

### Greetings

**Trigger:** First-time issue/PR
**Action:** Posts welcome message

## Issue Types

### Content Issues

```yaml
type: content
examples:
  - 'Add [Resource Name]'
  - 'Remove outdated link: [URL]'
  - 'Update description for [Resource]'
labels: [awesome]
```

### Documentation Issues

```yaml
type: documentation
examples:
  - 'Update CONTRIBUTING.md'
  - 'Improve AGENTS.md'
  - 'Adjust PR template copy'
labels: [docs]
```

### Security Issues

```yaml
type: security
examples:
  - 'Dependency vulnerability in awesome-lint workflow'
  - 'Unsafe repository automation configuration'
labels: []
```

## Data Structures

### Canonical Data File

`data/entries.json`

### README Entry Format

```markdown
- [Title](https://example.com/) - Brief description ending with period.
```

### Resource Schema

```json
{
	"title": "string",
	"description": "string",
	"url": "string (URL)",
	"region": [
		"Africa|Asia|Austria|Europe|France|Germany|Global|Great Britain|Netherlands|North America|Switzerland"
	],
	"language": ["ISO language code"],
	"type": [
		"audiovisual sources|books|collection|encyclopedias|learning materials|magazines|manuscripts|maps|newspapers|photos|portal|primary sources|search engine|sheet music|statistics|tools|websites"
	],
	"period": ["prehistory|ancient|classical|medieval|early modern|modern|contemporary"]
}
```

## Maintenance Workflow

1. Update `data/entries.json`.
2. Run `pnpm run prebuild`.
3. Run `pnpm run format`.
4. Run `pnpm run lint`.
5. Run `pnpm run awesome-lint`.

## Requirements

```json
{
	"node": ">=20",
	"pnpm": ">=10",
	"packageManager": "pnpm@10.32.1"
}
```

## Quality Gates

Pre-merge checklist:

- [ ] `pnpm run prebuild` passes
- [ ] `pnpm run awesome-lint` passes
- [ ] `pnpm run lint` passes
- [ ] Links manually verified
- [ ] Alphabetical order maintained
- [ ] Description follows format
