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

## [0.6.0] — 2026-05-10

### Changed — hide unpublished numbers from emergency surfaces
Records with the placeholder phone `+91 00000 00000` (provider exists but contact number not yet found) are no longer surfaced where users could tap-to-nothing:

- **`/find`** filters out no-phone providers from "5 nearest" and pincode lookup.
- **`/v1/providers.json`** and **`/v1/by-pincode/{pin}.json`** exclude no-phone records by default; new `total_in_dataset` + `hidden_no_phone` counts publish the gap honestly.
- **Map** (`/find`, `/explore`) renders no marker for no-phone records (no tap-to-nothing).
- **Per-provider / per-hospital pages** replace the phone-button with a yellow "📵 No published number yet" banner linking to Edit-on-GitHub and dial-108.
- **`/explore`** surfaces a separate "Records waiting for a published number" table so contributors can still see the gap and help fill it.

### Added — verification form (after-call YAML auto-generation)
Closing the loop on "I made the call, now how do I commit the verification?":

- **New `VerifyForm.astro` component** — structured form (date, initials, outcome, confirmed phone, vehicle types, equipment, fares, affiliations, notes).
- **Cloudflare Worker** extended with `form_type: "verify"` — generates a paste-ready YAML patch and opens a `[VERIFY]` GitHub issue with the patch in the body, plus a direct Edit-on-GitHub link.
- **Wired into `/verify-session`** (10-record maintainer queue) and **`/providers/[id]`** (only when a phone exists; hidden inside `<details>` to keep the user-facing page calm).
- Verification time per call drops from ~5 min of YAML editing to ~30 sec of paste-and-commit.

### Bumped
- Service worker → `v1.0.8`

## [0.5.0] — 2026-05-12

### Added — source-published badge
Honest fix for the aggregator-first positioning. Adds a fourth live-trust state between phone-verified and third-party-only:

- **New `status: source-published`** — number / data comes from the provider's own published source (their website, hospital page, government listing) but we haven't independently phone-called. Visible as a **blue badge** distinct from grey "unverified".
- **`unverified` is now reserved** for records sourced only from third-party listings (JustDial-class), where neither we nor the provider has stood behind the data.
- **Schema enum extended** in `provider.schema.json` and `hospital.schema.json`.
- **Badge function updated** across `scripts/build-api.ts`, `validate.ts`, `freshness-report.ts`, `trends.ts`, and `site/src/lib/data.ts`.
- **Migration script** flipped 54 provider records + 25 hospital records from `unverified` to `source-published` based on source-URL provenance (own-website + government-domain heuristics).
- **CSS** (`.badge--source-published` blue) added to `Base.astro`.
- **Documentation guide, /notice, /freshness, /trends, embed widget** updated to show the new badge with explanation.

### Fixed
- Embed widget SVG was crashing on the new badge value before this update.

### Result
Before this rev: 67 records said "unverified" — implying we didn't know if the numbers worked. **They did** — they came from the providers' own websites.
After: 54 providers + 25 hospitals correctly tagged as "source-published". The 6 remaining `unverified` records are genuinely unconfirmed (Medulance SPA-rendered records with placeholder phones).

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
