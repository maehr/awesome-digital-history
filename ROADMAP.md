# Roadmap

This roadmap turns known gaps in Awesome Digital History into concrete improvement tracks. It prioritizes changes that make entries more useful for historical source criticism, make the project easier to contribute to, and clarify editorial responsibility.

## Goals

- Help researchers evaluate digital archives before using them.
- Make contribution paths understandable for novice and non-technical users.
- Improve transparency around authorship, review, provenance, and AI-assisted text.
- Add contextual metadata that helps users move between directory entries and external knowledge sources.
- Support spatial, temporal, and data-driven discovery of entries.

## 1. Replace `Why it matters` With Structured Source Criticism

Current entry pages use a short `## Why it matters` section. This is useful but too generic for archive evaluation.

Replace it with a structured assessment model based on the source-search scaffold from [Critical AI Literacy for Historians](https://maehr.github.io/critical-ai-literacy-for-historians/en/exercises/source-search-vorort-council-of-europe-1963.html).

Proposed sections for archive entries:

- `## What you can find`: content scope, material types, geography, chronology, languages, and digitization depth.
- `## How to search`: search fields, filters, controlled vocabularies, browsing options, multilingual search, OCR/full-text search, APIs, and export options.
- `## What to watch`: gaps, selection bias, OCR quality, metadata limits, paywalls, access restrictions, unstable links, missing provenance, or unclear reuse rights.
- `## Research use`: concrete examples of historical questions the resource can support.
- `## Citation and reuse`: recommended citation pattern, rights statement, license, and download/reuse conditions where available.

Implementation tasks:

- Define the new entry body template.
- Decide whether all sections are mandatory or whether some may be omitted when information is unavailable.
- Update validation rules to detect the new headings.
- Migrate archive entries first, then learning resources and other directory sections if useful.
- Keep `short_description` concise for the generated README while expanding entry pages for deeper evaluation.

## 2. Add A Filter Reset Button

The directory filters currently need a clear reset action.

Implementation tasks:

- Add a visible `Reset filters` button near the filter controls.
- Reset free-text search, section, region, type, language, and any future filters.
- Make the button keyboard accessible and screen-reader friendly.
- Hide or disable the button when no filters are active, if this does not make the UI less predictable.
- Add a regression check for combined filters and reset behavior.

## 3. Clarify Who Is Behind The Project

The About page should explain the people and community behind the directory, not only the technical structure.

Proposed wording direction:

- Awesome Digital History is a community effort driven by [Moritz Mähr](https://moritzmaehr.ch/) and members of the [Digital History Network Switzerland](https://www.digitalhistorynetwork.ch/en/home).
- The project welcomes contributions from historians, archivists, librarians, teachers, students, and digital humanities practitioners.
- Editorial decisions should stay transparent and be discussed through GitHub issues and pull requests.

Implementation tasks:

- Update `ABOUT.md` with a project ownership and community section.
- Add links to the project lead and network.
- Clarify how contributors are credited.
- Keep the existing contributors graph link as a technical record, but do not make it the only explanation of project responsibility.

## 4. Make Contributing Easier For Novice Users

The current contribution guide assumes familiarity with GitHub, pull requests, and local development.

Implementation tasks:

- Add a non-technical contribution path at the top of `CONTRIBUTING.md`.
- Explain that contributors can suggest a resource by opening an issue or sending the required information without running any code.
- Rewrite issue templates with plain-language prompts.
- Replace Markdown issue templates with GitHub Issue Forms where useful.
- Add dropdowns for controlled vocabulary fields such as section, region, language, resource type, and period.
- Add examples of good resource suggestions.
- Add a checklist for maintainers to turn non-technical suggestions into entries.
- Consider adding a web form outside GitHub if GitHub remains a barrier for non-technical contributors.
- Keep the technical pull request workflow, but separate it clearly from the beginner path.

## 5. Add More Context For Each Entry

Entries should connect resources to external knowledge graphs and reference pages where possible.

Candidate metadata fields:

- `wikidata`: Wikidata item URL or QID.
- `wikipedia`: Wikipedia article URL.
- `same_as`: other authority, institutional, or registry URLs.
- `maintainer`: responsible institution or project team.
- `country`: country or countries of the maintaining institution, if different from collection coverage.
- `access_model`: open, freemium, subscription, institutional access, mixed, or unknown.
- `api`: API, IIIF, OAI-PMH, SPARQL, bulk download, or none documented.
- `rights_url`: rights or reuse policy URL.

Implementation tasks:

- Decide which fields belong in the YAML header and which belong in the entry body.
- Extend validation to enforce URL shape and controlled values where practical.
- Update templates and issue forms.
- Display context links on entry pages without cluttering the generated README.
- Start with high-value fields: `wikidata`, `wikipedia`, `maintainer`, `access_model`, and `api`.

## 6. Track Added Date, AI Review, And Human Responsibility

The YAML header should make editorial provenance explicit.

Proposed fields:

```yaml
date_added: 2026-04-25
ai_generated: false
ai_reviewed: false
reviewed_at: 2026-04-25
reviewed_by: []
authors: []
contributors: []
```

Field meanings:

- `date_added`: date when the entry was added to the collection, in `YYYY-MM-DD` format.
- `ai_generated`: whether any entry text was drafted with AI assistance.
- `ai_reviewed`: whether AI-assisted text has been checked by a human editor.
- `reviewed_at`: date when the entry text or metadata was last reviewed by a human editor.
- `reviewed_by`: human reviewers who checked AI-assisted or substantially revised text.
- `authors`: people responsible for the original entry text.
- `contributors`: people who made later corrections, metadata additions, or review improvements.

Implementation tasks:

- Decide whether names should be plain strings, GitHub usernames, ORCID URLs, or structured objects.
- Update entry schema validation.
- Add these fields to all new-entry templates.
- Backfill `date_added` from Git history where possible.
- Backfill authorship and review fields conservatively; use empty lists when responsibility cannot be verified.
- Add a contributor credit display on entry pages if it does not distract from resource evaluation.

## 7. Publish An Editorial Policy

The project should make inclusion, exclusion, and review decisions explicit.

Implementation tasks:

- Document what belongs in the directory and what does not.
- Define criteria for archives, primary-source portals, learning resources, tools, and meta-lists.
- Explain how entries are reviewed, updated, deprecated, or removed.
- Explain how AI-assisted text may be used and what human review is required.
- Link the policy from `ABOUT.md`, `CONTRIBUTING.md`, and issue forms.

## 8. Improve Spatial And Temporal Browsing

The current filters support region and period, but archive discovery would benefit from more exploratory views.

Implementation tasks:

- Add map-based browsing for archives with geographic coverage.
- Decide whether map points represent maintaining institutions, collection coverage, or both.
- Add timeline browsing by historical period or collection coverage.
- Consider structured date coverage fields such as `coverage_start` and `coverage_end`.
- Make map and timeline views optional enhancements so the directory remains usable without JavaScript-heavy interactions.

## 9. Export The Directory As Data

The entries already form a structured dataset. Users should be able to reuse it without scraping the website.

Implementation tasks:

- Add a downloadable JSON export of all entries.
- Add a downloadable CSV export for spreadsheet users.
- Include stable fields such as title, URL, section, region, language, resource type, period, context links, review fields, and date added.
- Generate exports from `entries/*.qmd` to avoid parallel data maintenance.
- Link exports from the website and document reuse conditions.

## 10. Improve Accessibility And Filter Feedback

The directory should be easy to use with keyboards, screen readers, and assistive technologies.

Implementation tasks:

- Audit color contrast, keyboard navigation, visible focus states, labels, and screen reader announcements.
- Add clearer empty states when filters return no results.
- Display full language names in filter options instead of only language codes.
- Keep language codes available in metadata for machine-readable exports.
- Include accessibility checks in the release or review workflow where practical.

## 11. Add A Dashboard Or Report

Maintainers need an overview of collection quality and maintenance work.

Implementation tasks:

- Add a generated dashboard or report with collection statistics.
- Show counts by section, region, language, resource type, period, access model, API availability, and review status.
- Show maintenance signals such as missing screenshots, missing context links, stale reviews, broken links, and entries without provenance fields.
- Generate the report during validation or as a separate script.
- Link the report from the roadmap or maintainer documentation.

## Suggested Phasing

### Phase 1: Editorial Transparency

- Update `ABOUT.md` with project/community responsibility.
- Add beginner-friendly contribution instructions.
- Add provenance fields to templates and validation.
- Publish an editorial policy with inclusion, exclusion, review, AI-use, and removal criteria.

### Phase 2: Usability

- Add the filter reset button.
- Add clearer empty states when filters return no results.
- Display full language names in filter options.
- Audit color contrast, keyboard navigation, and screen reader labels.
- Improve issue templates for non-technical contributors.
- Replace Markdown issue templates with GitHub Issue Forms and controlled dropdowns where useful.
- Add examples and maintainer checklists.

### Phase 3: Richer Entry Metadata

- Add context fields for Wikidata, Wikipedia, maintainer, access model, API, and rights.
- Update entry page rendering.
- Pilot the expanded metadata on a small set of entries.
- Add JSON and CSV exports generated from `entries/*.qmd`.
- Add a generated dashboard/report with collection and maintenance statistics.

### Phase 4: Spatial And Temporal Discovery

- Add map-based browsing for archives with geographic coverage.
- Add timeline browsing by historical period or collection coverage.
- Add structured coverage fields if needed for accurate map and timeline views.

### Phase 5: Structured Archive Analysis

- Finalize the replacement for `Why it matters`.
- Migrate archive entries using the source-search scaffold.
- Review migrated entries for accuracy, bias, access conditions, and research usefulness.

## Open Questions

- Should the structured source-criticism scaffold apply only to archives and primary sources, or also to learning resources and tools?
- Should AI-related fields be mandatory for every entry, or only for entries created after the policy is adopted?
- What is the preferred identity format for `authors`, `contributors`, and `reviewed_by`?
- Should non-technical contributions be accepted through GitHub only, or should the project provide an additional form outside GitHub?
- How much contextual metadata should be shown in the generated README versus only on entry pages?
