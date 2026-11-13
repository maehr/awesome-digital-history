# Contribution Guidelines

Awesome Digital History is a community-maintained directory of digital history resources. We welcome new entries, corrections, updates, and removals.

This file is the only source for the contribution process. The [Editorial Policy](EDITORIAL_POLICY.md) gives the criteria for inclusion, review, and removal.

You do not need to know Git, Node.js, or Quarto. An issue is enough. A maintainer can turn it into an entry.

## Summary

| You want to                         | What to do                                                                                                                                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add a new resource                  | Open an [Addition issue](https://github.com/maehr/awesome-digital-history/issues/new?template=addition.yml). Wait for the `approved` label. Then a maintainer or you open a pull request.                                             |
| Correct, update, or remove an entry | Open a [Change](https://github.com/maehr/awesome-digital-history/issues/new?template=change.md) or [Removal](https://github.com/maehr/awesome-digital-history/issues/new?template=removal.md) issue, or open a pull request directly. |
| Report a security problem           | Read [SECURITY.md](SECURITY.md).                                                                                                                                                                                                      |

## Add a new resource

All contributors must follow these steps. This includes returning contributors.

1. Search the directory and the open issues for the resource.
2. Open an [Addition issue](https://github.com/maehr/awesome-digital-history/issues/new?template=addition.yml) and fill in all required fields.
3. Wait until a maintainer adds the `approved` label.
4. Open one pull request for the approved resource, or let a maintainer write the entry.
5. Link the approved issue in the pull request description, for example `Closes #123`.

An approved issue does not guarantee inclusion.
A workflow closes a pull request that adds an entry without a link to an approved issue.
Repository collaborators are exempt from this check.

### How maintainers assess a proposal

Maintainers assess each proposal against the [Editorial Policy](EDITORIAL_POLICY.md) and on its evidence:

- The resource supports a concrete historical research or teaching task.
- The resource adds value that existing entries do not give.
- Documentation, an institution, or publications show that the resource is reliable.
- Access terms and limits are clear.

We do not require academic publications, institutional affiliation, or a minimum audience. Such rules would exclude useful small projects.

## Correct, update, or remove an entry

You do not need an approved issue for these changes:

- Improve a description or metadata.
- Fix a broken link.
- Remove an outdated entry.

Explain the reason and link your evidence in the issue or pull request.

## AI and automation

- We welcome AI-assisted contributions when an accountable human has checked them.
- Check every AI-generated statement against the resource. AI text must not invent features, coverage, dates, access conditions, or licenses.
- Disclose material AI assistance.
- Disclose your affiliation with the resource or any commercial interest.
- Autonomous AI agents must not submit issues or pull requests without human review.
- We do not accept mass-produced, promotional, or duplicate submissions.

Maintainers assess submissions on their evidence and conduct. They do not judge whether the text sounds AI-generated.

## How maintainers enforce this process

- A maintainer can ask for more information on an incomplete proposal.
- A maintainer can close repeated promotional or automated submissions without a full review.
- Maintainers keep editorial discretion. They give a short reason when they decline a submission.
- Maintainers use neutral language. They do not call a person a bot without evidence.

## Technical path: open a pull request

1. Fork the repository.
2. Run `npm install`.
3. Run `npm run hooks:install` to enable the local `prek` Git hooks.
4. Edit or add one file in `entries/*.qmd`. Do not edit `README.md` or `index.qmd` by hand, because they are generated.
5. If you added an entry, run `npm run screenshots`. If you changed a source URL, run `npm run screenshots -- --force --slug <slug>`.
6. Run `npm run generate`. Commit the updated `README.md` together with your entry.
7. Run the local checks:

   ```bash
   npm run hooks:run
   npm run check
   ```

   The checks do not change your files. They fail if `README.md` is out of date.

8. Submit a pull request against `main`.

Use [Conventional Commits](https://www.conventionalcommits.org/), for example `feat: add Example Archive resource` or `fix: update broken source URL`. The `commit-msg` hook and GitHub Actions run `commitlint`.

If a maintainer asks for changes, update the same pull request. Do not open a new one.

### Entry example

```yaml
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
```

Add a body of at least 140 characters under `## Why it matters`. Use canonical BCP 47 language tags, for example `en`, `la`, `ddn`, or `mul`. If a value is wrong, `npm run validate` names the allowed values.

To hide a cookie banner or popup in the screenshot, add `screenshot_hide` with a list of CSS selectors.

Fill in provenance fields conservatively. Do not claim review or authorship that you cannot verify.

## Maintainer checklist

When you turn an approved issue into an entry:

1. Verify the title, URL, description, and controlled vocabulary values against the resource.
2. Add the `entries/*.qmd` file and fill in the provenance fields.
3. Generate the screenshot.
4. Run `npm run generate` and commit the updated `README.md`.
5. Run `npm run hooks:run` and `npm run check`.
6. Link the issue in the pull request.

## Code of Conduct

Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

Licensed under CC0 and AGPLv3.
