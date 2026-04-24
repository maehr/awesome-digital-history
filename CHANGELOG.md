# Changelog

All notable changes to the directory data are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Historical entries were reconstructed from git history because older releases were not tagged. Dates refer to commit dates on the main history; older README-only changes sometimes record link-title rewrites as remove/add pairs.

## [Unreleased]

### Changed

- Added period filter and refined metadata badges.

### Fixed

- Updated external URLs for shifted resources.


### Added

- Added this reconstructed data changelog.

## 2026

### Added

- Added `World Radio History`.
- Added `Kulturgüter der Schweiz online`.
- Added Zotero groups `Digitale Quellenkritik` and `Historical Network Research`.
- Added `Critical AI Literacy for Historians`.
- Added six Southeast Asian and African database entries: `National Library of South Africa Digital Collections`, `ProQuest`, `South Asia Commons`, `South Asian Newspapers`, `Southeast Asian & Caribbean Images (KITLV)`, and `Southeast Asian Newspapers`.

### Changed

- Reclassified `Southeast Asian & Caribbean Images (KITLV)` from Netherlands to Global.
- Classified resource types and periods across many structured entries.
- Migrated canonical data from `src/lib/data/entries.json` to `data/entries.json`, then to individual `entries/*.qmd` pages with entry metadata and screenshot fields.
- Marked placeholder screenshots explicitly after the Quarto migration.

### Removed

- Removed outdated `We think History`.

## 2025

### Added

- Added `SKKG Digital Collection`.
- Added Icelandic resources: `handrit.is`, `islandskort.is`, `ÍSMÚS`, and `tímarit.is`.
- Added `EuroDocs – Online Sources for European History`.
- Added Dutch resources `Atlas of Mutual Heritage` and `Topotijdreis`.
- Added `Scripta Paedagogica`.
- Added `Grundlagen, Methoden und Anwendungen der Digital History`.
- Added `swissnatcoll`.

### Changed

- Updated the `handrit.is` description.
- Standardized language metadata, including EuroDocs language codes, removal of `mul` language values, and conversion of Dendi to ISO code `ddn`.
- Removed `sheet music` from a resource type field where it did not fit the allowed type vocabulary.
- Normalized period values with validation and edge-case handling.
- Normalized and validated region, language, and resource type values.
- Updated `swissnatcoll` metadata to English-only and modern-period classification.

### Removed

- Removed `histHub`.

## 2024

### Added

- Added `West African Arabic Manuscript Database`.
- Added `Introduction to Python for Humanists`.
- Added `Sources Online`.

## 2023

### Added

- Added `Crafting Digital History`, `FOCAL`, `Fxtop`, `HathiTrust`, and `Sammlung Schweizerischer Rechtsquellen online` during the SvelteKit/data migration.
- Added `Introduction to Digital History`.
- Added `transcriptiones`.
- Added `historicum.net`.
- Added `HMML` and `PARC`.

### Changed

- Converted the README-first list into structured `entries.json` data for the SvelteKit site.
- Updated license, accessibility, reusability, security, and formatting metadata during several curation passes.
- Regenerated the README from structured data.

### Removed

- Removed non-accessible or out-of-scope entries including `CENDARI`, `PICTURA paedagogica`, and `Digithek`.

## 2022

### Added

- Added `Mementoweb` and `chgov`.
- Added `OpenHistoricalMap` and `World Historical Gazeteer`.
- Added `Public Books Database`, `Digital Transgender Archive`, `DigiBern`, and `History Toolkit`.
- Added `Deutsches Zeitungsportal` and `Digital Humanities`.
- Added archive entries `The National Archives`, `National Records of Scotland`, `National Archives`, `Nationaal Archief`, and `United Nations Archive`.
- Added learning resource `Python für Historiker:innen`.

### Changed

- Moved `British Library` to the Great Britain section.
- Began migrating data into the SvelteKit project structure late in the year.

### Removed

- Removed `DHTools`.

## 2021

### Added

- Added `Institut national de l'audiovisuel`, `Bitsavers.org`, and `World Digital Library`.
- Added Austria-focused resources `ANNO`, `Mapire`, `Monasterium`, and `Uni Frankfurt`.
- Added Great Britain and North America resources `British Library`, `Chronicling America`, and `Digital Public Library of America`.
- Added Swiss resources `arCHeco` and `Kartenportal`.
- Added German resources `Archivportal`, `Bavarikon`, `Deutsche Digitale Bibliothek`, `Digitale Sammlungen`, `leo bw`, `SLUB Dresden`, `UB Heidelberg`, and `ZLB`.
- Added `Tempopedia`, `LexM`, `Digitarium`, `Österreichische Mediathek`, `Wien Geschichte Wiki`, `Visual Archive Southeastern Europe`, `swisscollections`, `Karlsruher Virtueller Katalog`, `OpenCat`, `MARCHIVUM`, `Schweizerisches Wirtschaftsarchiv`, and `Geospatial Historian`.
- Added computer-history resources `Computerarchiv Muenchen`, `Classic Computer Magazine Archive`, and `Computer Gaming World Museum`.
- Added `Encyclopédie d'histoire numérique`, `Année Politique Suisse`, `gotpapers.scene.org`, and `DHTools`.

### Fixed

- Corrected minor typos.

### Removed

- Removed `Digital History Wiki`.

## 2020

### Added

- Added `Project Gutenberg`, `Projekt Gutenberg`, `Digithek`, `Rijksstudio`, and `TinEye`.
- Added `NLS`, `Poppler`, `QPDF`, `ImageMagick`, and `OCRmyPDF`.
- Added `e-gs`, `Historical Encyclopedia of Switzerland`, and `Missing Semester`.
- Added `Le Temps`, `Zefys`, `Ad*Access`, `The Proceedings of the Old Bailey`, `Women Working 1800-1930`, and `HIST3814o`.
- Added podcast-related entries including `15past15`, `Backstory`, `Revisionist History`, `Stuff You Missed in History Class`, `You're Dead To Me`, `Histoire Vivante`, `Podcast des Historischen Instituts der Universität Bern`, `Zeitblende`, and `Cliocast`.
- Added `Amtsdruckschriften`, `DARIAH-DE Geo-Browser`, `The Vistorian`, `Recogito`, `The CTP Book`, `Eugenics Archive`, `map.geo.admin.ch`, `Docupedia`, `Local Linkages`, and `Consolation Prize`.
- Added `WayBackMachine`, `We think History`, `Computer History`, `Data Visualization`, `Research Tools`, and `Scientific Writing` during the November scope refactor.

### Changed

- Reorganized the README into broader regional and topical sections such as Europe, France, Germany, Global, Great Britain, Netherlands, North America, Switzerland, Learning, and More Awesome.
- Refined the list scope toward open, accessible digital-history resources.

### Removed

- Replaced `Historical Dictionary of Switzerland` with `Historical Encyclopedia of Switzerland`.
- Removed `Scalar`.
- Removed many tool, podcast, center, platform, and social-media entries during the November scope refactor, including `JabRef`, `Tropy`, `Zotero`, `OpenArchive`, `Social Feed Manager`, `Transkribus`, `Textgrid`, `webrecorder.io`, `Voyant`, `Omeka`, `DHSlack`, and several DH center and Twitter-list entries.

## 2019

### Added

- Launched the directory with early archive, newspaper, map, tool, and learning resources including `Europeana`, `Archives Online`, `Archives Portal Europe`, `Internet Archive`, `E-Periodica`, `e-newspaperarchives.ch`, `MEMOBASE`, `COSMOV`, `Delpher`, `e-rara`, `e-manuscripta`, `Gallica`, `Transkribus`, `Open Semantic Search`, and `DocFetcher`.
- Added `Lexos`, `training.parthenos-project.eu`, `CENDARI`, `TextGrid`, `digitalhist.hypotheses.org`, `Spiegel Online`, `We think History`, `UCI Digital History`, `Clio Guide`, and `HSS Digital`.
- Added map and political-history resources including `Perry-Castañeda Library Map Collection`, `David Rumsey Map Collection`, `Ad*Access`, `Marxist Internet Archive`, and `Tito's Home Page`.
- Added a large structured README pass with named resources such as `Current Research in Digital History`, `Diplomatic Documents of Switzerland`, `infoclio.ch Edition projects`, `Awesome Computer History`, `histHub`, `HSSO`, `timeSTAT Cubes`, `Industriekultur`, `Historical Dictionary of Switzerland`, `Stanford Encyclopedia of Philosophy`, `AdFontes`, `Digital Humanities Literacy Guidebook`, `StorylineJS`, `StorymapJS`, `TimelineJS`, `Gephi`, `Palladio`, `Zotero`, `JabRef`, `Tropy`, `webrecorder.io`, `Social Feed Manager`, `OpenArchive`, `Data Pen`, `Breve`, `Voyant`, `Scalar`, `Omeka`, and several DH center resources.
- Added `The Programming Historian`, `fxtop.com`, `HIST 7370`, `Open EU Data Portal`, `Digitales Deutsches Frauenarchiv`, `Data Augmentation`, `forText`, `Framework for Information Literacy for Higher Education`, `AutoCat`, `OldMapsOnline`, `e-codices`, `Manifold`, `DHSlack`, and several digital-history Twitter lists.

### Changed

- Reordered sections, fixed titles and wording, and converted several bare URLs into named resources.
- Moved `guides.lib.uci.edu` into Learning.

### Removed

- Removed `JSTOR` because it was not open access.
- Removed `digitalhist.hypotheses.org` shortly after adding it.
- Removed `dirtdirectory.org` because it was offline.
- Removed `archives-online.org` once because of 404s, then re-added it as `Archives Online`.
- Removed `Tito's Home Page` after it stopped responding.

[Unreleased]: https://github.com/maehr/awesome-digital-history/commits/main
