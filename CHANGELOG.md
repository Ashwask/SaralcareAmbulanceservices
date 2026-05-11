# Changelog

All notable changes to the Saralcare Ambulance Directory.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). The
**data** carries an independent schema version recorded in `SCHEMA.md`.

## [Unreleased]

### Added
- (planned) Hindi / Kannada / Tamil i18n scaffolding
- (planned) Public moderation queue dashboard
- (planned) Mirror federation guide expansion

## [0.1.0] — 2026-05-11

Initial open-source release scaffold. **Not yet publicly announced.**

### Added
- Project scaffold: data, schema, scripts, site, workers, sources.
- Data: 60 ambulance provider records + 25 hospital records across 7 Indian
  metros + 12 state-level 108 services. 67 records carry real phones scraped
  from publicly-published provider/hospital websites; all records flagged
  `status: unverified` until phone-call verification.
- Schemas: JSON Schema 2020-12 for `provider`, `vehicle`, `hospital`, `report`.
- Scripts: `validate`, `build-api`, `freshness-report`, `reverify-queue`,
  `ingest-osm`, `ingest-justdial`, `ingest-google-places`, `seed-india`,
  `apply-scrape`.
- Site: 99-page Astro static build. Emergency-first home, per-provider /
  per-hospital pages, `/explore` transparency hub, `/for-providers`
  registration + claim hub, `/notice` (how the site works), `/saved` (offline
  contacts), `/freshness`, `/license`, `/disclaimer`, `/takedown`,
  `/changes`.
- PWA: `manifest.webmanifest`, service worker with cache-first for data and
  map tiles, offline fallback page, installable on home screen.
- UX safety: IVR routing notice on chain-helpline records, one-tap "Number
  didn't work" report on every card with localStorage flag + Worker → GitHub
  issue submission.
- Cloudflare Worker (`workers/submit`) for form submissions to GitHub Issues;
  fall-through to `mailto:` when not deployed.
- Licensing: CC BY-NC-SA 4.0 (data), MIT (code), CC BY-SA 4.0 (content).
- Governance: single-maintainer v1 with documented v2 transition triggers.
- Process docs: README, CONTRIBUTING, GOVERNANCE, DISCLAIMER, TAKEDOWN,
  LICENSE-FAQ, COMMERCIAL, SCHEMA, NOTICE.
- RTI drafts: three staged applications to NHM Karnataka.
- Launch materials: LinkedIn post, handover checklist.
- Tier-1 open-source infrastructure: issue templates, PR template,
  CHANGELOG, CODE_OF_CONDUCT, SECURITY, CONTRIBUTORS, ADRs, CITY-TEMPLATE,
  MIRRORING.

### Known gaps (intentional)
- 0 records verified by phone call (founder verification cycle not yet
  started — gates the green badge until first calls happen).
- Cloudflare Worker not deployed (forms work via `mailto:` fallback).
- Domain `ambulance.saralcare.com` not yet pointed at hosting.
- No lawyer review of disclaimer yet.
- English only.

### Schema version
- `1.0.0`

[Unreleased]: https://github.com/Ashwask/SaralcareAmbulanceservices/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Ashwask/SaralcareAmbulanceservices/releases/tag/v0.1.0
