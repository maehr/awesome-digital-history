# Contribution Guidelines

Awesome Digital History is a community-maintained directory of digital history resources. We welcome new entries, corrections, updates, and removals.

This file is the only source for the editorial criteria and the contribution process. You do not need to know Git, Node.js, or Quarto. An issue is enough. A maintainer can turn it into an entry.

## Summary

| You want to               | What to do                                                                                                                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add a new resource        | Open an [Addition issue](https://github.com/maehr/awesome-digital-history/issues/new?template=addition.yml). Wait for the `approved` label. Then you or a maintainer opens a pull request.      |
| Change or remove an entry | Open a [Change or removal issue](https://github.com/maehr/awesome-digital-history/issues/new?template=change.yml), or open a pull request directly. You do not need approval for these changes. |
| Report a security problem | Read [SECURITY.md](SECURITY.md). Do not open a public issue.                                                                                                                                    |

## What we list

A listed resource must meet all of these criteria:

- It supports historical research, source criticism, teaching, or digital history practice.
- It is available online at a stable public URL.
- It adds value beyond a short-lived announcement, event page, or marketing page.
- Public information is sufficient to describe it accurately.
- The community can keep the entry accurate with reasonable effort.

Each entry belongs to one section of the directory:

| Section        | The resource                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `archives`     | Gives access to digitized or described historical sources, collection search, or finding aids.     |
| `learning`     | Teaches methods, tools, theory, or practices that historians and digital humanists can use.        |
| `more-awesome` | Is another curated list or directory that is useful for research, data work, writing, or teaching. |

Paid, freemium, and institutional-access resources are allowed. The entry must state the access limits when they are known.

## What we do not list

We decline a resource when one or more of these conditions apply:

- It is not related to history, archives, cultural heritage, or digital research.
- It is offline, abandoned, or available only through unstable links.
- It is mainly promotional, commercial, or about an event, and it has no durable research value.
- The submitter promotes their own resource and does not disclose the affiliation.
- It duplicates an existing entry and adds no new coverage, language, access, or method.
- It causes legal, privacy, safety, or ethical concerns.

## Add a new resource

All contributors must follow these steps. This includes returning contributors.

1. Search the directory and the open issues for the resource.
2. Open an [Addition issue](https://github.com/maehr/awesome-digital-history/issues/new?template=addition.yml) and fill in all required fields.
3. Wait until a maintainer adds the `approved` label.
4. Open one pull request for the approved resource, or let a maintainer write the entry.
5. Link the approved issue in the pull request description, for example `Closes #123`.

An approved issue does not guarantee inclusion. A workflow closes a pull request that adds an entry without a link to an approved issue. Repository collaborators are exempt from this check.

Maintainers assess each proposal on its evidence:

- The resource supports a concrete historical research or teaching task.
- The resource adds value that existing entries do not give.
- Documentation, an institution, or publications show that the resource is reliable.
- Access terms and limits are clear.

We do not require academic publications, institutional affiliation, or a minimum audience. Such rules would exclude useful small projects.

## Change or remove an entry

To change or remove an entry, open a [Change or removal issue](https://github.com/maehr/awesome-digital-history/issues/new?template=change.yml) or a pull request. Explain the reason and link your evidence.

Change an entry when its URL, access conditions, metadata, description, or screenshot is out of date.

Maintainers remove an entry when one of these conditions applies:

- The resource is permanently offline, and no replacement or archived version exists.
- The resource no longer matches the scope of the directory.
- The entry duplicates a better or more authoritative entry.
- The resource raises an unresolved ethical, legal, privacy, or safety concern.
- Public information is not sufficient to keep the entry accurate.

If you request a removal, suggest an alternative or an archived version when you know one.

## AI and automation

- We welcome AI-assisted contributions when an accountable human has checked them.
- Check every AI-generated statement against the resource. AI text must not invent features, coverage, dates, access conditions, licenses, APIs, or institutions.
- Disclose material AI assistance.
- Disclose your affiliation with the resource or any commercial interest.
- Autonomous AI agents must not submit issues or pull requests without human review.
- We do not accept mass-produced, promotional, or duplicate submissions.

Maintainers assess submissions on their evidence and conduct. They do not judge whether the text sounds AI-generated.

## Open a pull request

You need [Node.js](https://nodejs.org/) 24 or later and [Quarto](https://quarto.org/). For screenshots, run `npx playwright install chromium` once.

1. Fork the repository.
2. Run `npm install`.
3. Run `npm run hooks:install`. The Git hooks then check each commit.
4. Add or edit one file in `entries/`. Do not edit `README.md` or `index.qmd`, because a script generates them.
5. If you added an entry, run `npm run screenshots`.
6. If you changed `external_url`, run `npm run screenshots -- --force --slug <slug>`.
7. Run `npm run generate`.
8. Run `npm run check`. The check does not change files. It fails if `README.md` is out of date.
9. Commit the entry, its screenshot, and `README.md` together.
10. Open a pull request against `main`.

Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, for example `feat: add Example Archive` or `fix: update broken source URL`.

If a maintainer asks for changes, update the same pull request. Do not open a new one.

### Entry file

Each entry is one file, `entries/<slug>.qmd`. It has YAML front matter and a short body:

```markdown
---
title: Example Archive
slug: example-archive
external_url: https://example.org/
short_description: Search portal for digitized nineteenth-century newspapers from Exampleland.
description: Example Archive gives full-text access to digitized nineteenth-century newspapers from Exampleland.
directory_section: archives
section_label: Archives and primary sources
regions: [Europe]
languages: [en]
resource_types: [newspapers, primary sources, search engine]
periods: [modern]
date_added: 2026-01-31
authors: []
contributors: []
screenshot: /assets/screenshots/example-archive.png
screenshot_alt: Screenshot of Example Archive
image: /assets/screenshots/example-archive.png
---

## Why it matters

Example Archive gives full-text search across regional newspapers from 1820 to 1914. Researchers can use it to trace local reactions to national events.
```

Rules for an entry:

- Write a body of at least 140 characters under the heading `## Why it matters`.
- Write a `description` of 60 to 180 characters.
- End `short_description` with a full stop.
- Use canonical BCP 47 language tags, for example `en`, `la`, `ddn`, or `mul`.
- Use `regions` only in `archives` entries.
- Add `learning materials` to `resource_types` in `learning` entries.
- Set `section_label` to match `directory_section`.
- To hide a cookie banner or a popup in the screenshot, add `screenshot_hide` with a list of CSS selectors.
- Add a name to `authors` or `contributors` only when you can verify it.

If a value is not valid, `npm run validate` shows the allowed values.

## Maintainer guide

### Triage proposals

- Check each Addition issue against [What we list](#what-we-list) and [What we do not list](#what-we-do-not-list).
- If the proposal meets the criteria, add the `approved` label.
- If the proposal is incomplete, ask for more information.
- If you decline the proposal, give a short reason and close the issue.
- You can close repeated promotional or automated submissions without a full review.
- Use neutral language. Do not call a person a bot without evidence.

### Write an entry from an approved issue

1. Verify the title, URL, description, and controlled values against the resource.
2. Add the file `entries/<slug>.qmd`.
3. Run `npm run screenshots`.
4. Run `npm run generate`.
5. Run `npm run check`.
6. Open a pull request that links the issue.

### Review and merge

- A pull request needs one approval and four passing checks: `Build and Upload Artifacts`, `lychee`, `commitlint`, and `prek`.
- Use a squash merge.
- After a merge to `main`, the `quarto-publish.yml` workflow deploys the site to GitHub Pages.

### Broken links

The `lychee` workflow checks all links on each push and pull request. If it reports a broken link, find the cause:

- If the resource moved, update `external_url` and recapture the screenshot.
- If the resource works in a browser but blocks automated requests, add its URL to `exclude` in `.lycheerc.toml`. Add a comment with the date.
- If the resource is gone, remove the entry.

### Screenshots

The screenshot script opens a visible browser window, because some sites block headless browsers. If a capture fails, the script writes a placeholder image to the `screenshot` path. Check each new image before you commit it.

To replace a placeholder with a real screenshot:

1. Set `screenshot` and `image` to `/assets/screenshots/<slug>.png`.
2. Run `npm run screenshots -- --slug <slug>`.
3. Delete the old file `assets/screenshots/<slug>-placeholder.png`.

### Dependencies

Dependabot opens one grouped pull request each week for npm packages and one for GitHub Actions. Merge it when all checks pass.

## Code of Conduct

Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
