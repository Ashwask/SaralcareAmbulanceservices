# ADR 0001: Use CC BY-NC-SA 4.0 for data, MIT for code, CC BY-SA 4.0 for content

- **Status:** Accepted
- **Date:** 2026-05-10
- **Deciders:** founding maintainer

## Context

A directory of ambulance providers in India needs a licence. Two pressures
compete:

1. We want the dataset to be **maximally useful for the public good** —
   patients, doctors, hospitals, NGOs, journalists, government, researchers,
   civic-tech projects. The data is most useful when it is openly available
   and properly attributed.
2. We want to **prevent for-profit aggregators from absorbing the dataset
   into their walled-garden products** without compensating the project.
   Existing aggregators (RED.Health, Medulance, Dial4242, JustDial)
   could ingest a freely-licensed dataset and use it to undercut the
   directory's own credibility.

We considered three licence families: permissive (CC BY, ODbL), share-alike
(ODbL, CC BY-SA), and non-commercial (CC BY-NC-SA, CC BY-NC).

## Decision

We adopt a **multi-licence** approach:

| Layer | Licence | Why |
|---|---|---|
| **Data** (`data/**`, generated `api/v1/**`) | **CC BY-NC-SA 4.0** | Non-commercial freedom for individuals, doctors, hospitals (for patient care), journalists, NGOs, civic-tech, government EMS; commercial use requires a separate bilateral licence |
| **Code** (`scripts/**`, `site/**`, `workers/**`, schemas) | **MIT** | Maximum fork-ability and re-use; the code has no captive value, the dataset does |
| **Content** (README, blog posts, prose docs) | **CC BY-SA 4.0** | Journalists and educators can republish writing about the project commercially with attribution |

Commercial use of the dataset is permitted *on a case-by-case, bilateral
basis only*. There is no public price list, no self-serve. See
`COMMERCIAL.md`.

## Consequences

**Good:**
- A for-profit aggregator cannot legally ingest the dataset into a paid
  product without coming to us first. The licence enforces the
  conversation.
- Public-good users — the bulk of intended users — face zero friction.
- Share-alike on the data means derivative datasets remain open.
- The code being MIT lets anyone fork the *implementation* without legal
  drag — including provider self-service forks, civic-tech mirrors, and
  city-specific spin-offs.
- The content being CC BY-SA lets a journalist quote the methodology in a
  for-profit newspaper without asking.

**Costs:**
- CC BY-NC-SA is controversial in the open-data community. Some open-data
  purists treat the NC clause as a betrayal of openness. We accept that
  criticism. The trade-off is intentional: we judged the risk of
  for-profit capture as larger than the cost of NC friction.
- We have to maintain three separate licence files and answer occasional
  "wait, which licence applies to X?" questions. We mitigate via
  `LICENSE-FAQ.md` with worked examples.
- We can't dual-licence the data as also CC0 (some governments require CC0
  for data ingestion). If that becomes a blocker, we'll revisit.

## Alternatives considered

- **Open Database Licence (ODbL 1.0).** OSM's licence. Share-alike but not
  non-commercial. Considered first. Rejected because share-alike on a
  database doesn't actually deter a commercial aggregator from ingesting
  the data — they can release their own derivative DB under ODbL and still
  build proprietary products around it. We wanted the for-profit gate to
  be explicit, not a legal puzzle.
- **CC BY 4.0** (attribution-only, no share-alike, no NC). Too permissive.
  RED.Health could legally absorb the dataset, attribute us in 8pt grey in
  their footer, and outdistribute us with their fleet + capital.
- **CC0 / public domain.** Maximally open. Rejected for the same reason as
  CC BY.
- **AGPLv3 for the data.** AGPL is a code licence, not a data licence —
  inappropriate fit. Mentioned only because Notion users sometimes
  suggest it.
- **Proprietary with a public-good carve-out.** Considered briefly during
  v3 planning. Rejected as antithetical to the project's premise.

## When this might be revisited

- A formal Section 8 not-for-profit entity is registered and may want to
  re-licence with cleaner governance rights.
- The Government of India or NHM Karnataka offers to ingest the data and
  requires CC0 / Government Open Data Use Licence (GODL-India).
- A clear path to a paid commercial channel emerges that justifies a
  cleaner dual-licence (e.g., a self-serve API tier).

Any change requires a new ADR superseding this one and a public re-licence
announcement.
