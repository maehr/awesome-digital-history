# Contribution Guidelines

Please note that this project is released with a Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

---

## We welcome

- **Additions**
- **Removals** 
- **Edits**
- **Reorganisations to the Archive**

--

# Contributing to the South Asian Digital History Repository

We welcome contributions to our repository on South Asian digital history. Our goal is to create a comprehensive digital archive and history of the digital in this region, and we need your help to make it happen. Here's how you can contribute:

## Contributing to digital archives

Many countries in South Asia are still in the process of digitizing their physical archives, and some may not have many archives available digitally. If you're from one of these countries, don't worry - you can still contribute to our project. Here are some ways you can help:

   - Share any digital archives or sources related to South Asian digital history that you have access to.
   - Provide descriptions, metadata, or translations for existing archives or sources.
   - Help us identify gaps in the existing archives or sources and suggest ways to fill them.

## Contributing to the "history of the digital" in South Asia

The internet proliferation in South Asia happened relatively recently, and the "history of the digital" in this region is still being written. If you're interested in contributing to this aspect of our project, here are some ways you can help:

   - Share your own experiences or insights on the history of the digital in South Asia.
   - Help us research and document key events, trends, and figures in this history.
   - Old forgotten forums to peruse through
   - Suggest areas or topics that we should focus on to provide a more comprehensive picture of the digital in South Asia.

## Contributing to the long-term vision

Our project is a long-term one, and we understand that progress may be slow in some areas. However, every contribution counts, no matter how small. If you're interested in contributing to our long-term vision, here are some ways you can help:

    - Spread the word about our project and encourage others to contribute.
    - Provide feedback or suggestions for improving our repository and making it more accessible.
    - Help us raise awareness of the importance of preserving and documenting South Asian digital history.

Thank you for your interest in contributing to our project. With your help, we can create a valuable resource for researchers, students, and anyone interested in the digital history of South Asia.



## I want to add, remove or edit something 

If you are proficient with GitHub, follow the instructions below. Otherwise open an [issue](https://github.com/micahchoo/awesome-digital-history-South-Asia/issues/new/choose).

## Method 1 (Easy)
- open an [issue](https://github.com/micahchoo/awesome-digital-history-South-Asia/issues/new/choose).
- Add a description

## Method 2 (Less Easy)
If you want to contribute to our project, you can submit a pull request with your changes. Here's how to do it:

-    Fork the project repository on Github.
-    Clone the forked repository to your local machine.
-    Create a new branch for your changes.
-    Make your changes and commit them to your local branch.
-    Push your local branch to your forked repository on Github.
-    Go to the original project repository on Github and create a new pull request from your forked repository.
-    Fill out the pull request form with a short description of your changes and any relevant details.
-    Submit your pull request for review.

### Things to keep in mind
-    Make sure that the table of contents has been updated if you're suggesting a new section or removing one.
-    Organize your suggestion alphabetically.
-    Once you've completed these steps, submit your suggestion for review.
-    Add a description

---

## Rubric for Evaluating Additions

Each candidate resource should meet **all required criteria** and ideally at least one bonus criterion.

### Required Criteria (must meet all)

| # | Criterion | Description |
|---|-----------|-------------|
| 1 | **South Asia relevance** | Resource must be about, from, or significantly related to South Asia (Afghanistan, Bangladesh, Bhutan, India, Maldives, Myanmar, Nepal, Pakistan, Sri Lanka, Tibet, or the subcontinent broadly) |
| 2 | **Digital accessibility** | Resource must be accessible online — a working URL that leads to usable content (not fully paywalled, not a dead link) |
| 3 | **Relates to the history of the digital or digital histories** | Resource must either (a) document how technology, the internet, or digital culture evolved in South Asia, or (b) provide digitized access to historical materials from/about the region |
| 4 | **Not a duplicate** | Resource must not already be listed or substantially overlap with an existing entry |

### Bonus Criteria (strengthen the case for inclusion)

| # | Criterion | Description |
|---|-----------|-------------|
| A | **Fills an underrepresented region** | Contributes to a sparse section (Myanmar, Maldives, Sri Lanka, Bhutan, Nepal, NE India, Andaman & Nicobar, Lakshadweep) |
| B | **Surfaces marginalized perspectives** | Voices or materials from communities underrepresented in traditional archives (caste, gender, indigenous, religious minorities, etc.) |
| C | **Unique materiality** | Contains materials not typically found in formal archives (blogs, forums, oral histories, street art, community media, pamphlets, etc.) |
| D | **At risk of disappearing** | Content that is endangered, from defunct platforms, or preserved via the Wayback Machine |

### What we leave out

- Institutional landing pages, research guides, directories and organization homepages with nothing browsable behind them
- Current news sites and advocacy organizations, unless the entry points to a specific archive or historical artifact
- Shop or album pages, paywalled databases, and catalogues without digitized items
- Resources only loosely tied to history (current academic journals, scientific surveys, food blogs, mountaineering records)

### Accuracy

- Wayback Machine links must use a snapshot that actually exists. Check with `https://archive.org/wayback/available?url=<site>&timestamp=<YYYYMMDD>`.
- Keep descriptions short and factual. Don't include figures or "first/largest" claims you can't source.

---

## Rubric for "History of the Digital in South Asia" Section

This section documents how the internet, technology, and digital culture arrived, evolved, and were experienced in South Asia. These are not digitized archives OF history, but artifacts and accounts of **digital history itself**.

A resource should fit **at least one** of the following categories:

| # | Category | Description | Examples |
|---|----------|-------------|----------|
| 1 | **First websites & homepages** | Early national or community websites, typically captured via the Wayback Machine | Manzoor's Homepage for Bangladeshis (1995), Bhutan Post (2002), Free Tibet (1996) |
| 2 | **Early blogs & forums** | Personal and community blogs or forums from the early web era that show how South Asians used the internet to speak, debate, and connect | Rezwan's blogs (2003), BOL forums (1999), Chapati Mystery (2004) |
| 3 | **Pioneer online media** | First online newspapers, magazines, or publications from each country | NepalNews (1999), Himal Southasian (1997), Nagaland Post |
| 4 | **Internet infrastructure narratives** | Accounts of how connectivity arrived: submarine cables, ISPs, cybercafes, first email nodes, fiber rollouts | How fiber came to Cox Bazaar, Netchakra chronology, Pakzilla timeline |
| 5 | **Digital rights & shutdowns** | Documentation of internet shutdowns, censorship, surveillance, and digital resistance | Myanmar Internet Project |
| 6 | **Community voices online** | How marginalized or minority communities used the early web for advocacy, identity, and solidarity | Where is Kalpana Chakma, MINORITY on meghbarta, Letters to the Internet |
| 7 | **Found digital artifacts** | Rediscovered fragments of early South Asian web presence — the archaeology of the internet | "Someone found remnants of the very early internet in India" |

**Formatting:** Include the year or era in the entry name when possible (e.g., `Secular Maldives - 2007`).

## Appendix: running lint tests
 To run tests locally:
    # using ruby
    gem install awesome_bot
    awesome_bot README.md
    # using node.js
    npm install -g awesome-lint
    awesome-lint README.md
