# For your first contribution

Welcome. This file lists **specific, well-bounded tasks** that a first-time
contributor can ship in under 90 minutes — without needing to read the
whole codebase first. Each one teaches you the project's protocol while
producing real value.

Pick one. Open the linked issue (we'll file these at launch). Submit a PR.
We respond within 48 hours.

## Easiest — no programming required

### 1. Re-verify a Bangalore provider by phone

**Skill:** willingness to make a phone call.
**Time:** ~10 minutes.
**Value:** moves one record from unverified → verified, flipping its badge from grey to green.

1. Open the [verify session helper](https://ambulance.saralcare.com/verify-session) (when site is live).
2. Pick a record. Call the listed number.
3. Run through the [call script](https://github.com/Ashwask/SaralcareAmbulanceservices/blob/main/CONTRIBUTING.md#the-verification-phone-call-script).
4. Click "Edit on GitHub" on the record's page. Change `status: unverified` → `verified`, set `last_verified_at` and `verified_by`, add a `call_logs` entry. Commit.

### 2. Translate the homepage into your native Indian language

**Skill:** native fluency in Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Malayalam, or Punjabi.
**Time:** ~30 minutes.
**Value:** the homepage becomes usable for ~150M+ more people.

1. Open [`site/src/i18n/strings.ts`](https://github.com/Ashwask/SaralcareAmbulanceservices/blob/main/site/src/i18n/strings.ts) on GitHub.
2. Click ✎ to edit. Find your language stub. Fill in the keys, starting with the user-facing critical strings (`home.title`, `home.geolocate`, `home.call_108_title`, `card.fallback_108`).
3. **Critical:** medical-emergency copy must be exactly right. "Dial 108" must not be translated literally — use your language's natural way of saying "dial the number 108."
4. Submit the PR. Tag the issue [`i18n`](https://github.com/Ashwask/SaralcareAmbulanceservices/issues?q=is%3Aopen+label%3Ai18n).

### 3. Add a missing Bangalore provider you know about

**Skill:** local knowledge of an ambulance service we don't list.
**Time:** ~15 minutes.
**Value:** the directory grows.

1. Use the [new-provider form](https://ambulance.saralcare.com/providers/new) — fills the YAML for you.
2. Or [open a structured issue](https://github.com/Ashwask/SaralcareAmbulanceservices/issues/new?template=new-provider.yml).
3. We verify by phone before merging.

### 4. File an RTI with your state's health department

**Skill:** filling out forms, willingness to send a letter.
**Time:** ~20 minutes + postage.
**Value:** unlocks structured state 108 data that's currently opaque.

1. Take a [draft template](https://github.com/Ashwask/SaralcareAmbulanceservices/tree/main/sources/rti) (RTI-1, RTI-2, or RTI-3).
2. Adapt it to your state — change "NHM Karnataka" to your state's health department address.
3. Print, sign, attach a ₹10 postal order, send by registered post.
4. When you get a response (typically 30 days), open an issue with `[RTI]` tag — we ingest the response into the dataset.

## Beginner programming

### 5. Improve a record's pincode service area

**Skill:** edit YAML.
**Time:** ~5 minutes.
**Value:** more pincodes route to the right provider.

1. Pick a provider in your city.
2. Click "Edit on GitHub" on their record page.
3. In `service_areas.pincodes`, add the pincodes they actually serve that we don't list.
4. Add a `sources` entry citing where you got the pincode list (provider's own page, your own conversation with them, etc.).
5. Commit.

### 6. Fix a typo or improve wording in the docs

**Skill:** read English, click "Edit" on GitHub.
**Time:** ~5 minutes.
**Value:** signal-quality of the project goes up.

Targets: README, CONTRIBUTING, GOVERNANCE, NOTICE, anything in `decisions/`.

### 7. Add a "Top 10 stale records" weekly digest script

**Skill:** TypeScript / Node, comfortable with file I/O.
**Time:** ~45 minutes.
**Value:** maintainer gets an automated reminder of what's about to go stale.

1. Add `scripts/stale-digest.ts` that reads `data/providers/*.yaml`, computes ages, emits a Markdown digest of the 10 most-overdue records.
2. Wire to a `.github/workflows/stale-digest.yml` running weekly that posts the digest as a GitHub issue.

## Intermediate programming

### 8. Add a "find by hospital" search

**Skill:** Astro + JS.
**Time:** ~90 minutes.
**Value:** a new useful query path for users.

1. New page `/by-hospital`.
2. Input: hospital name (autocomplete from `getHospitals()`).
3. Output: the affiliated provider(s) from `hospital_affiliations`, plus the 3 nearest non-affiliated providers as comparison.

### 9. Wire OSM contribution back

**Skill:** OpenStreetMap account + Overpass API familiarity.
**Time:** ~60 minutes.
**Value:** every verified ambulance station gets a node in OSM that the rest of the open-data world can use.

1. After a record is verified, push its lat/lng + name into OSM as an `emergency=ambulance_station` node.
2. Code lives in `scripts/contribute-to-osm.ts`.
3. Use a separate OSM account dedicated to this bot; document its usage.

### 10. Build an accessibility audit script

**Skill:** Playwright / axe-core.
**Time:** ~2 hours.
**Value:** every PR gets an automated a11y check.

1. `.github/workflows/a11y.yml` that builds the site, runs Playwright against every page with axe-core, fails PR if new violations introduced.
2. Publish the report as an artifact on the PR.

---

## Things we don't need yet (don't start on these without discussing)

- A native mobile app. The PWA is enough for v1.
- Custom map tile rendering. OSM raster tiles are fine.
- A new programming language port. Stay in TS.
- A redesign. The UX is in active iteration; wait for v0.3 spec.

## How to introduce yourself

Open a [Discussion](https://github.com/Ashwask/SaralcareAmbulanceservices/discussions) saying which task you're picking. Helps avoid duplicate work and lets the maintainer offer pointers.

## After your first merged contribution

- Open a PR adding yourself to [`CONTRIBUTORS.md`](https://github.com/Ashwask/SaralcareAmbulanceservices/blob/main/CONTRIBUTORS.md) (opt-in).
- If you found the documentation unclear, please open a docs PR fixing what tripped you. We learn from the fresh-eyes view.
- If you want commit rights for ongoing maintenance, propose it via a [Governance issue](https://github.com/Ashwask/SaralcareAmbulanceservices/issues/new?template=governance.yml). The path to commit rights is documented in [GOVERNANCE.md](https://github.com/Ashwask/SaralcareAmbulanceservices/blob/main/GOVERNANCE.md).

Thank you for being the first person who decided this was worth their time.
