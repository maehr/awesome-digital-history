# Agents

Automation notes for `awesome-digital-history`.

## Commands

```bash
npm run generate       # Write README.md and index.qmd from entries/*.qmd
npm run generate:check # Fail if README.md is out of date. Writes nothing.
npm run validate       # Check entry metadata
npm run build          # Validate, write index.qmd, render _site
npm run preview
npm run clean
npm run lint           # Prettier check
npm run awesome-lint
npm run commitlint     # Pass -- --edit <file> or -- --last
npm run check          # generate:check, build, lint, awesome-lint
npm run hooks:install  # Install the prek pre-commit and commit-msg hooks
npm run hooks:run      # Run the prek hooks on all files
npm run screenshots    # Capture missing screenshots; -- --force --slug <slug> to recapture
```

## Canonical Source

- Source of truth: `entries/*.qmd`. Shared Quarto options: `entries/_metadata.yml`.
- Generated: `README.md` (tracked) and `index.qmd` (ignored). Do not edit them by hand.
- After an entry change, run `npm run generate`. Commit `README.md` with the entry.
- Checks and hooks do not write `README.md`. They fail if it is out of date.
- Screenshots: `assets/screenshots/<slug>.png` or `<slug>-placeholder.png`.

## Entries

- Entry example and rules: `CONTRIBUTING.md`, section "Entry file".
- Allowed values and validation: `scripts/lib/entries.mjs` (`SECTION_LABELS`, `ALLOWED_VALUES`, `validateEntryShape`).
- `npm run validate` names the allowed values on error.

## Contributions

- `CONTRIBUTING.md` is the only source for the editorial criteria and the contribution process.
- A new entry needs an Addition issue with the `approved` label.
- Do not submit an issue or a pull request without human review.

## Workflows

Required checks on `main`: `Build and Upload Artifacts`, `lychee`, `commitlint`, `prek`.

- `quarto-publish.yml`: runs `npm run check`. On `main`, it deploys `_site` to GitHub Pages.
- `prek.yml`: runs the prek hooks.
- `commitlint.yml`: checks Conventional Commits on push and pull request commits.
- `link-check.yml`: runs `lychee` on Markdown and `.qmd` files. Exclusions: `.lycheerc.toml`.
- `addition-check.yml`: closes a non-collaborator pull request that adds an entry without an `approved` issue.

## Quality Gates

Run both before a pull request:

- `npm run hooks:run`
- `npm run check`

The hooks (`.pre-commit-config.yaml`) check file hygiene, formatting, entry metadata, `README.md` drift, and `awesome-lint`. The `commit-msg` hook runs `commitlint`.
