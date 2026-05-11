# ADR 0004: Scope is pan-India from launch, not Bangalore-only

- **Status:** Accepted
- **Date:** 2026-05-11
- **Deciders:** founding maintainer

## Context

The original plan called for a Bangalore-only v1 launch — verify 30
providers locally, ship a credible dataset for a single city, then expand
to other metros over months. This is the conservative path.

The founding maintainer reversed this in plan rev 4, requiring the UX and
data scaffold to work for any Indian pincode from day one. Reasons:

- A user with a Bangalore pincode sees Bangalore providers; a user with a
  Delhi pincode should see Delhi providers. Anything else feels broken.
- The state-level 108 EMS structure (Maharashtra MEMS, Tamil Nadu, AP,
  Telangana, Kerala, etc.) is meaningful per-state — Bangalore-only data
  would have to fake-include all of these or omit them.
- The aggregators (RED.Health, Medulance, Ziqitza) already operate
  multi-city; restricting them to Bangalore mis-represents their actual
  service area.
- The hospital chains (Apollo, Manipal, Fortis, Max, Narayana) are
  national; per-city records are needed to map their affiliations
  honestly.

## Decision

The product is **pan-India from launch**. Specifically:

- **Home page copy:** "Find an ambulance in India" (not "in Bangalore").
- **Pincode entry:** accepts any valid Indian PIN; resolves to a city
  centroid via prefix lookup.
- **Map:** defaults to India bounding box, fits to feature bounds on load.
- **/explore:** city filter with all cities present in the dataset.
- **Data scope:** 7 metros (Bangalore, Mumbai, Delhi NCR, Chennai,
  Hyderabad, Kolkata, Pune) seeded at launch; 12 state 108 records; major
  hospital chains per-city.
- **Future expansion:** ingestion scripts (OSM Overpass, Google Places,
  JustDial CSV intermediate) are scoped per-city — new metros are added
  by extending the seed table and re-running.

The verification cadence remains:
- Bangalore: weekly (founder-led initially).
- Mumbai / Delhi / Chennai / Hyderabad / Kolkata / Pune: monthly.
- Other cities: quarterly until volunteer city-captains exist.

## Consequences

**Good:**
- The UX feels honest from day one. No user lands and sees "this site
  doesn't work for my city".
- The state 108 layer is published — useful for cross-state contributors
  and journalism.
- The pan-India scaffold makes the project **forkable** — see
  `CITY-TEMPLATE.md`.
- We can credibly tell hospital chains "we list you across all your
  campuses".

**Costs:**
- Per-record data quality outside Bangalore is initially lower. Most
  non-Bangalore records will land as `unverified` until verification
  calls happen.
- The launch announcement must acknowledge this honestly. The LinkedIn
  post calls out "10 records verified by phone, ~170 still need
  verification — help us by calling and reporting back".
- Verification scale becomes the binding constraint earlier than it would
  have been in a Bangalore-only launch. Volunteer city captains are now
  in the critical path.
- More cities = more potential dispute surface (more hospitals, more
  providers who might take issue with a record).

## Alternatives considered

- **Bangalore-only v1.** Conservative path. Rejected by the founder
  after seeing the v3 build — a directory that only works for one city
  doesn't feel like a directory of India.
- **Bangalore + 2 cities.** Half-measure. Rejected for the same UX
  reason: a Mumbai user with a Chennai pincode would still see no data.
- **Crawl-first, then verify.** Run OSM + Google Places + JustDial across
  all India, accept the noise, verify in waves. Considered. We did this
  for the metros we cover, but didn't push to all 19,000 Indian
  pincodes — the verification-call workload would be impossible and the
  noise would erode trust faster than the coverage gain would earn it.

## When this might be revisited

- After 6 months of operation, evaluate which cities have organic
  contributor / report activity. Cities below a floor (e.g., <1 user
  report / month) may be deprioritised in verification rotation.
- If a state-level partnership emerges (e.g., NHM Karnataka adopts the
  Karnataka data slice as a reference), that state may justify
  city-level granularity — taluk/district records below the metro level.
