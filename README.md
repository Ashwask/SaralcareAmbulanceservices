# Saralcare Ambulance Directory

An open, verified, phone-by-phone directory of every ambulance provider we
can find — starting with Bangalore, growing across India. Government 108
stations, private aggregators, hospital-owned fleets, charities, and
standalone operators, all on one map. Each record carries the date it was
last verified by phone.

**Live site:** https://ambulance.saralcare.com
**License inquiries (commercial):** ashwinsk@saralcare.com
**Corrections and takedown:** ashwinsk@saralcare.com (subject: `[CORRECTION]` or `[TAKEDOWN]`)

---

## Why this exists

In an emergency, a patient or family has no way to see "the closest three
ambulances right now" across the dozens of providers operating in their
city. Hospitals route to whichever provider they have a relationship with.
Aggregators only show their own fleets. The government 108 line works but
publishes nothing about its station locations, fleet capacity, or response
times. JustDial and similar directories are stale and unverified.

The result: patients see one option when fifty exist. They pay the lock-in
tax in cash and in minutes.

This project is the open commons that the market hasn't built — because
every incumbent is structurally forbidden from neutrality by their own
incentives.

---

## What's here

```
data/
  providers/      One YAML file per ambulance provider.
  hospitals/      One YAML file per hospital, with affiliation pointers.
  affiliations/   provider × hospital edges with sources.

schema/           JSON Schema for all data types.
sources/          Provenance — RTI letters and responses, scraped HTML
                  snapshots, redacted call-log notes.
site/             Astro static site (the public-facing map + directory).
scripts/          Validators, ingest scripts, build pipeline.
api/v1/           Generated JSON API artifacts, deployed to CDN.
launch/           Launch announcement materials.
corrections/      Public log of takedown / correction requests + outcomes.
```

---

## Using the data

The data is free for any non-commercial use under
**CC BY-NC-SA 4.0** (see `LICENSE-DATA`). That includes individuals,
families, doctors, hospitals routing patients, journalists, researchers,
NGOs, civic-tech projects, and government EMS.

**For-profit / commercial use** requires a separate bilateral license.
Email `ashwinsk@saralcare.com` with your use case. See
`COMMERCIAL.md` and `LICENSE-FAQ.md`.

The code (Astro site, scripts, schemas) is MIT-licensed — fork freely.

---

## Information only — no liability, no operational role

Saralcare Ambulance Directory is an **information aggregator**. We
compile and publish data about ambulance providers in India in good
faith, drawn from public sources, verification phone calls, and
contributor submissions.

**We do not, and will not:**
- Operate, own, dispatch, or coordinate any ambulance.
- Hold real-time vehicle availability or location data.
- Guarantee, endorse, or recommend any specific provider.
- Accept payments from listed providers, nor accept advertising or
  paid placement.
- Have any contractual, operational, or financial relationship with any
  provider listed on this site.
- Verify or warrant the continuous accuracy, completeness, or fitness for
  purpose of any record.

**By using this site or this dataset, you acknowledge:**
- This information is provided "AS IS" without any warranty, express or
  implied.
- The maintainers, contributors, and rights-holder **accept no
  responsibility and no liability** for any outcome arising from the
  use of, or reliance upon, the information published here — including
  but not limited to delayed dispatch, incorrect numbers, stale fares,
  outdated affiliations, vehicle-type misclassification, or any
  consequence of acting upon a record.
- You assume **full responsibility** for verifying details by direct phone
  call before relying on any record.
- **In any medical emergency, call 108 (Arogya Kavacha / state EMS)
  directly.** This site is not a substitute for emergency services and
  must not be used as one.

Providers who find an inaccurate record can request a correction or
takedown — see `TAKEDOWN.md`. We respond within 48 hours.

Full disclaimer: `DISCLAIMER.md`.

---

## How records get verified

The maintainer (and, later, volunteer city captains) calls each provider
on the published number, runs a short script, and logs:

- Whether the number was answered.
- Vehicle types operated (BLS / ALS / MICU / PTA / Neonatal / Cardiac).
- Service area claimed.
- Hospital affiliations (which hospital ERs route calls to this provider).
- Fares disclosed verbally, with date.

A record is `verified` for **30 days** from the last call. After 30 days
it becomes `stale` (amber badge). After 60 unconfirmed days it is hidden
from the map and listed as `dead` in the repo for provenance.

**Freshness is the product.** Anyone can scrape JustDial; nobody else has
the discipline to pick up the phone every week.

See `CONTRIBUTING.md` for the verification script and how to submit a
correction or new record.

---

## How to contribute

1. **Report a wrong number or stale record.** Open a GitHub issue (or
   email `ashwinsk@saralcare.com` with subject `[CORRECTION]`) with the
   provider ID and what you tried. We re-verify and update.

2. **Add a missing provider.** Open a pull request with a new YAML file
   under `data/providers/`. Include at least one source (a website URL,
   a phone-call log, or a public listing).

3. **Re-verify a stale record.** Pick a record with a stale badge, call
   the number, and submit a PR updating `last_verified_at` and any fields
   that changed. Include `caller_initials` and the date.

4. **Help with affiliations.** If you work at or near a Bangalore
   hospital and can confirm which provider their ER routes to, open an
   issue with the source (a webpage, a leaflet, a phone call with the
   ER desk).

Full verification protocol: `CONTRIBUTING.md`.

---

## Governance

v1 is benevolent-dictator: the maintainer reviews and merges all PRs.
v2 onward will move to a small editorial council, especially for
affiliation-graph edits (which carry defamation risk and warrant multiple
reviewers). See `GOVERNANCE.md`.

---

## Contact

- **Commercial licensing:** `ashwinsk@saralcare.com`
- **Corrections / takedown:** `ashwinsk@saralcare.com` (subject line: `[CORRECTION]` or `[TAKEDOWN]`)
- **General inquiries:** `ashwinsk@saralcare.com`
- **GitHub issues:** preferred channel for technical issues and data fixes

This project is maintained under the Saralcare umbrella. The dataset
and site are an information aggregator only — no operational role, no
liability accepted (see Disclaimer above and `DISCLAIMER.md`).
Correspondence is acknowledged within 48 hours.
