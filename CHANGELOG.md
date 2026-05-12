# Changelog

All notable changes to the Saralcare Ambulance Directory.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). The
**data** carries an independent schema version recorded in `SCHEMA.md`.

## [Unreleased]

### Planned
- Native-speaker review of Hindi + Kannada translations
- Tamil / Telugu / Marathi / Bengali / Malayalam translations
- Third-party WCAG audit
- Section 8 entity registration (triggered by first traction milestone)
- Discord / community channels (founder action)
- First commercial-license inquiry tracking

## [0.2.0] — 2026-05-12

### Added — Tier 2 open-source engine
- **`/open-source` hub page** — single landing for every open-source artefact (repo, licences, ADRs, CoC, security, contributors, governance, fork + mirror guides, attribution string).
- **`/moderation` public dashboard** — live read of GitHub Issues API (no auth) showing the open queue by category, oldest pending, overdue count vs. SLA.
- **`/changes` page** — site-side render of `changelog.json` commit history.
- **`/accessibility` commitment page** — WCAG 2.1 AA target, what's done, known gaps, how to report a11y bugs. Honest punch-list, not legal cover.
- **`/donate` page** — explicit "not yet accepting donations" with reasoning, what we'd spend on, future grant targets, what to do instead.
- **`/federation` page** — known mirrors + regional forks, schema for self-registration.
- **In-browser editor entry** — every provider + hospital page has an "✎ Edit on GitHub" deep-link to the YAML in GitHub's web editor. Reduces contributor bar from "fork + clone + commit" to "click + edit + PR".
- **i18n scaffolding** — `site/src/i18n/strings.ts` with English baseline + machine-translated Hindi + Kannada (flagged as awaiting native review). Language switcher in nav. Stubs for Tamil, Telugu, Marathi, Bengali, Malayalam. Runtime DOM replacement via `data-i18n` attributes; choice persisted in localStorage.
- **Accessibility primitives** — skip-link, `aria-label`s, `aria-live` on status messages, `aria-pressed` on toggles, focus indicators, semantic landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`).
- **Federation manifest** — `data/mirrors.json` + `schema/mirrors.schema.json` + emitted at `/v1/mirrors.json`. PR-based mirror / fork registration.
- **`GRANTS.md`** — public log of grant programmes we're targeting + status. Wikimedia, Mozilla MOSS, Bloomberg, Omidyar, Open Society listed.
- **`COMMUNITY.md`** — Discord / Telegram setup steps, monthly office-hour cadence, contribution paths.
- **`.github/FUNDING.yml`** — placeholder for GitHub Sponsors, activated when entity exists.
- **`DEPLOY.md`** — 15-minute quick-start that collapses the handover checklist into the critical-path commands.
- Canonical URL set to **`https://www.ambulance.saralcare.com`** across schemas, site config, docs, Worker CORS.

### Changed
- Provider + hospital correction CTAs now show three explicit paths: "Edit on GitHub", "Claim listing" / "Email correction", and "Open structured issue". Contribution becomes 2 clicks for anyone with a GitHub account.
- Validator: cross-brand-only duplicate phone warning (national helplines across city records no longer trigger noise).
- `<html lang>` updated to chosen language on switcher use.

### Known gaps still
- 0 verified records — verification calls require human contact (deliberate).
- Discord not yet created (founder action).
- Section 8 entity not registered (deferred until traction).
- No professional WCAG audit (volunteer or grant-funded — planned).
- Hindi + Kannada translations not yet native-reviewed (flagged in the switcher).

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
