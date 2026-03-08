# MACH COMPUTING — Portfolio

Academic portfolio at [portfolio.machcomputing.com](https://portfolio.machcomputing.com).

## Overview

Publications and research portfolio that auto-syncs from ORCID. Sections: Publications, Research Areas, and Education.

Publication metadata is fetched from the ORCID public API and enriched with author/venue data from Crossref. Education entries are also pulled from ORCID. Both revalidate every 5 minutes via ISR.

## Tech Stack

Next.js 16 (App Router) / Tailwind CSS v4 / TypeScript / React 19

## Setup

```bash
npm install
npm run dev   # localhost:3001
```

No environment variables required. The ORCID ID is configured directly in `page.tsx`.

## Structure

```
app/
  globals.css    — Theme tokens, keyframe animations
  layout.tsx     — Root layout, fonts, metadata
  page.tsx       — Async Server Component (full page + data fetching)
public/
  logo.png       — Shield logo
  text_logo.png  — Wordmark
  favicon.ico
```

## Data Sources

| Source       | Endpoint                                   | Data                     |
| ------------ | ------------------------------------------ | ------------------------ |
| ORCID        | `pub.orcid.org/v3.0/{id}/works`            | Publications list        |
| Crossref     | `api.crossref.org/works/{doi}`             | Authors, venue names     |
| ORCID        | `pub.orcid.org/v3.0/{id}/educations`       | Education entries        |

ORCID ID: `0009-0005-6728-3089`

## Sections

| Section          | Content                                                        |
| ---------------- | -------------------------------------------------------------- |
| **Hero**         | Title + animated geometric composition                         |
| **Publications** | Auto-synced from ORCID. Author's name bolded, links to DOI/PDF |
| **Research**     | Algorithms, AI, HPC — static cards                             |
| **Education**    | Auto-synced from ORCID. Timeline with "Current" badges         |
| **Footer**       | Nav links + ORCID, Google Scholar, GitHub, LinkedIn            |

## Related

- [Home](https://machcomputing.com) — main landing page
- [Projects](https://projects.machcomputing.com) — interactive experiments
