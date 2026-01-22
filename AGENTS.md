# Agents

AI agents and automation for awesome-digital-history.

## Commands

```bash
# Validation
pnpm run awesome-lint        # Validate README.md against Awesome List standards
pnpm run lint                # Run prettier + eslint
pnpm run check               # Type check with svelte-check

# Build
pnpm run prebuild            # Sort JSON + compile README
pnpm run build               # Production build
pnpm run dev                 # Development server

# Test
pnpm run test                # Playwright e2e tests
pnpm run test:unit           # Vitest unit tests

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

| Label     | Files Changed                                                                              |
| --------- | ------------------------------------------------------------------------------------------ |
| `awesome` | `README.md`                                                                                |
| `docs`    | `.github/*`, `_layouts/*`, `assets/*`, `_config.yml`, `*.md` (except README), config files |

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
  - 'Add [Resource Name] to [Section]'
  - 'Remove outdated link:  [URL]'
  - 'Update description for [Resource]'
labels: [awesome]
```

### Technical Issues

```yaml
type: technical
examples:
  - 'CI workflow failing on Node 24'
  - 'Build error in prebuild script'
  - 'Broken link checker needed'
labels: [docs, bug]
```

### Documentation Issues

```yaml
type: documentation
examples:
  - 'Update CONTRIBUTING.md'
  - 'Add translation guidelines'
  - 'Improve AGENTS.md'
labels: [docs]
```

### Automation Issues

```yaml
type: automation
examples:
  - 'Add automated link validation'
  - 'Adjust stale threshold'
  - 'Configure dependabot'
labels: [automation, enhancement]
```

## Data Structures

### README Entry Format

```markdown
- [Title](https://example.com/) - Brief description ending with period.
```

### Labeler Configuration (`.github/labeler.yml`)

```yaml
label_name:
  - path/pattern
  - glob/**/*
```

**Available Labels:**

- `awesome` - Content changes
- `docs` - Documentation updates
- `no-issue-activity` - Stale issue
- `no-pr-activity` - Stale PR

### Workflow Triggers

```yaml
# Possible values
on:
  - push
  - pull_request
  - pull_request_target
  - issues
  - schedule:
      - cron: '0 0 * * *' # Daily at midnight UTC
```

### Resource Schema (Internal JSON)

```json
{
	"title": "string",
	"url": "string (URL)",
	"description": "string",
	"category": "enum[africa|asia|austria|europe|france|germany|global|great-britain|netherlands|north-america|switzerland|learning]",
	"tags": ["string[]"],
	"verified": "boolean"
}
```

## GitHub Copilot Usage

### For PRs

- Verify links are active (HTTP 200)
- Check alphabetical order within section
- Validate description ends with period
- Ensure no duplicates exist
- Run `pnpm run awesome-lint` before committing

### For Issues

- Search existing issues for duplicates
- Use appropriate labels
- Provide specific resource URLs
- Include section name for additions

### For Code Reviews

- Check CI passes
- Verify format consistency
- Test locally: `pnpm run dev`
- Validate build: `pnpm run build`

## Prebuild Scripts

Located in `utils/`:

```javascript
// utils/sortJSON.js - Alphabetically sorts resource JSON
// utils/compileReadme.js - Generates README.md from data
```

**Runs automatically before:**

- `pnpm run prepare`
- `pnpm run build`

## Requirements

```json
{
	"node": ">=20",
	"pnpm": ">=10",
	"packageManager": "pnpm@10.16.0"
}
```

## Quality Gates

Pre-merge checklist:

- [ ] `pnpm run awesome-lint` passes
- [ ] `pnpm run lint` passes
- [ ] `pnpm run check` passes
- [ ] `pnpm run test` passes (if applicable)
- [ ] Links manually verified
- [ ] Alphabetical order maintained
- [ ] Description follows format
