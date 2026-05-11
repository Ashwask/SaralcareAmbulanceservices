# Fork this project for your city or country

This project's structure is designed to be **fork-friendly**. If you want
to run a parallel ambulance directory for a city we don't cover, or for a
country outside India, this document tells you how.

We actively encourage forks under the licence — it's how civic
infrastructure spreads. We are happy to link to credible regional forks
from the main site.

## When a fork makes sense vs. when to contribute back

**Fork when:**
- You want to cover a country with different EMS structure (108 doesn't
  exist outside India).
- You want a different verification cadence or scoring methodology.
- You want a different licence (e.g., a country requires CC0 for civic
  data ingestion).
- You want a different language / culture footprint.
- You want different governance (e.g., funded by a regional charity).

**Contribute back when:**
- You're covering an additional Indian city. Open a PR adding seed data
  under `data/providers/` and `data/hospitals/`; we'll merge after a call.
- You're improving the schema, validator, build pipeline, or site code.
- You're translating the site into an Indian language.

## What a fork takes — the 90-minute checklist

1. **Clone and reset.**
   ```
   git clone https://github.com/Ashwask/SaralcareAmbulanceservices my-city-ambulances
   cd my-city-ambulances
   rm -rf .git
   git init -b main
   ```
   Now you have a fresh project history.

2. **Strip our seed data.** The data we shipped is Bangalore-Mumbai-Delhi-
   Chennai-Hyderabad-Kolkata-Pune-focussed. Delete what doesn't apply:
   ```
   rm data/providers/*.yaml
   rm data/hospitals/*.yaml
   rm data/affiliations/edges.csv
   ```
   Re-create the `edges.csv` header:
   ```
   echo "provider_id,hospital_id,exclusivity,source,observed_date,disputed" > data/affiliations/edges.csv
   ```

3. **Re-target the geography.** Edit `site/src/lib/distance.ts`:
   - Replace `CITY_CENTROIDS` with your city / region centroids.
   - Replace `PINCODE_PREFIX_CITY` with your equivalent postal-prefix
     mapping. (For non-Indian countries, you'll likely use postal codes,
     ZIP codes, or other locality identifiers — adjust the regex too.)
   - Replace `INDIA_CENTRE` with your country / region centre.

4. **Edit copy.** Search for "India" / "Bangalore" / "Bengaluru" /
   "108" / "Karnataka" across:
   - `site/src/pages/*.astro`
   - `site/src/layouts/Base.astro`
   - `README.md`, `NOTICE` page, `DISCLAIMER.md`, `LICENSE-FAQ.md`
   - `launch/linkedin-post.md`

   Replace with your country's equivalents. Most importantly: the
   **emergency number**. "Call 108" is hard-coded; if your country uses
   911, 112, 119, 999, etc., replace site-wide.

5. **Re-issue the emergency-protocol disclaimer.** `DISCLAIMER.md` and
   `NOTICE` reference the Indian regulatory frame (Indian IT Act,
   Bengaluru courts jurisdiction). Replace with your own jurisdiction.
   **Talk to a local lawyer.** Don't ship our disclaimer text verbatim.

6. **Adjust the licence if needed.** We picked CC BY-NC-SA 4.0 — see
   `decisions/0001-license-cc-by-nc-sa.md`. If a different licence fits
   your context (e.g., CC0 for a government-funded effort), write your
   own ADR superseding ours and update `LICENSE-DATA`.

7. **Set up your repo + hosting.** Follow `launch/handover-checklist.md`
   adapted to your provider:
   - Create a public GitHub repo.
   - Point a subdomain.
   - Deploy via Cloudflare Pages / Vercel / Netlify (any static host).
   - Deploy the Cloudflare Worker (or replace with your equivalent
     forms backend).
   - Set up an inbound email (`ashwinsk@...` equivalent).

8. **Seed your first 10 records.** Use the verification phone-call
   protocol in `CONTRIBUTING.md`. Real calls only. Don't paste numbers
   from JustDial — see our reasoning in the LICENSE-FAQ.

9. **Tell us.** Open a GitHub issue at
   <https://github.com/Ashwask/SaralcareAmbulanceservices/issues/new>
   tagged `governance` with subject `[FORK] <your-domain>`. We will link
   to credible forks from our site, and you to ours — federation by
   reciprocity, not by central control.

## Things you should NOT change without thought

- **The "information aggregator, no liability" framing.** This protects
  you legally in the same way it protects us. If you decide to operate
  ambulances or act as a dispatcher, the entire `DISCLAIMER.md` doesn't
  apply to you.
- **The freshness contract.** 30-day cycle + green/amber/grey/red badges
  is the project's moat. Skip it and you become JustDial.
- **The "no payments from providers" rule.** Once you accept money from a
  listed provider, the directory ceases to be a directory.
- **Source citations on every contested edge.** Affiliation graphs with
  "kickback" or "exclusive" assertions are how directories get sued. Edges
  describe behaviour, not motive — and only with a source.

## Things we'd love to see in forks

- **Translations of the site into Indian or regional languages.** We have
  no i18n infrastructure yet. A fork that solves this could be merged
  back as the canonical multi-lingual scaffold.
- **Country-specific 108 / 112 / 911 equivalent integrations.** The
  schema is currently India-flavoured; a properly internationalised
  schema could replace ours.
- **A11y / WCAG audit + fixes.** We have not done one. A fork that does
  becomes a contribution back.
- **A regional emergency response time benchmark.** The aggregation
  scripts (`build-api.ts → aggregateReports`) already produce per-provider
  stats; a fork can publish those as a regional report card.

## Federation, eventually

This is v1. Once enough forks exist, we'll work out a federation story:
a single index of regional ambulance directories, mirroring the way
OSM has regional/national chapters. For now, fork freely under the
licence and link back.
