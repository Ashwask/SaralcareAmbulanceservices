# Handover — what only you (the founder) can do

The repo is built. The site builds and renders end-to-end. The licences, schemas, scripts, and CI workflows are all in place. The remaining work is operational and gated by accounts, payments, or identity that I cannot access from inside this conversation.

This is the punch list to take the project from "fully functional locally" to "live and announced."

---

## 1. Create the public GitHub repository

**Why this is on you:** GitHub account ownership, org creation, and repo metadata defaults.

- [ ] Create a GitHub organisation `saralcare` (or use existing). Public.
- [ ] Create a new public repository `ambulance-india` (recommended name).
- [ ] Choose pseudonymous Git author for commits: e.g. `Saralcare Maintainer <maintainer@ambulance.saralcare.com>`. Configure in repo-specific `~/.gitconfig`:
  ```
  git config user.name "Saralcare Maintainer"
  git config user.email "maintainer@www.ambulance.saralcare.com"
  ```
- [ ] From the Ambulances/ folder, initialise and push:
  ```
  cd ~/Documents/Saralcare_moat/Ambulances
  git init -b main
  git add .
  git commit -m "Initial commit: Saralcare ambulance directory v0.1.0"
  git remote add origin git@github.com:Ashwask/SaralcareAmbulanceservices.git
  git push -u origin main
  ```
- [ ] In GitHub repo settings:
  - Enable Discussions (optional, for community).
  - Enable Issues with the Correction / Takedown templates (see step 2).
  - Add topics: `civic-tech`, `open-data`, `healthcare`, `india`, `ambulance`, `bengaluru`, `cc-by-nc-sa`.
  - Set the description: "Open, verified directory of ambulance providers in India. CC BY-NC-SA 4.0."
- [ ] Add CODEOWNERS file (optional) for the v1 single-maintainer model.

## 2. GitHub issue templates

Create `.github/ISSUE_TEMPLATE/correction.md` and `takedown.md` after the repo is public, based on the templates in `CONTRIBUTING.md` and `TAKEDOWN.md`.

## 3. DNS — point the subdomain

**Why this is on you:** DNS access to `saralcare.com` and Cloudflare account ownership.

- [ ] Log into the Cloudflare (or whichever DNS provider) for `saralcare.com`.
- [ ] Create a CNAME record:
  - Name: `ambulance`
  - Target: `<your-pages-project>.pages.dev` (set after Cloudflare Pages project is created — see next step)
  - Proxy: enabled (orange cloud)
  - TTL: auto.

## 4. Cloudflare Pages project

**Why this is on you:** Cloudflare account ownership + GitHub OAuth.

- [ ] Cloudflare dashboard → Pages → Create a project → Connect to GitHub → Select the `ambulance-india` repo.
- [ ] Build configuration:
  - Framework preset: `Astro`
  - Build command: `npm run site:build`
  - Build output directory: `site/dist`
  - Root directory: `/` (project root)
  - Environment variables: none required for v1.
- [ ] Deploy. First build will take ~3-5 minutes.
- [ ] Once deployed, copy the `*.pages.dev` URL into the DNS CNAME from step 3.
- [ ] Pages → Custom domains → Add `ambulance.saralcare.com`. Cloudflare auto-provisions the cert.
- [ ] Verify https://www.ambulance.saralcare.com renders.

## 5. GitHub Actions secrets (for auto-deploy)

**Why this is on you:** account credentials.

- [ ] GitHub repo → Settings → Secrets and variables → Actions → New repository secret:
  - `CLOUDFLARE_API_TOKEN` — create at Cloudflare dashboard, scoped to Pages.
  - `CLOUDFLARE_ACCOUNT_ID` — find in Cloudflare dashboard.
- [ ] Verify `.github/workflows/deploy.yml` runs on next push to main.

## 6. Email — set up `ashwinsk@saralcare.com` for inbound

**Why this is on you:** mail provider access.

- [ ] Confirm `ashwinsk@saralcare.com` accepts inbound mail.
- [ ] Optional: create email aliases that forward to the same inbox:
  - `corrections@ambulance.saralcare.com` → ashwinsk@saralcare.com
  - `license@ambulance.saralcare.com` → ashwinsk@saralcare.com
  - `hello@ambulance.saralcare.com` → ashwinsk@saralcare.com

  (Cloudflare Email Routing is free and works on the same subdomain. v1 is fine with just the single canonical address.)
- [ ] Draft a one-paragraph auto-reply for the `ashwinsk@saralcare.com` inbox: "Thanks for writing. We respond within 48 hours. For corrections, please include the provider ID and source. For licensing, describe your use case and integration scope." (Optional but professional.)

## 7. Verification calls — first 30 records

**Why this is on you:** the entire moat depends on the founder making the first 30 calls personally.

- [ ] Print the verification script from `CONTRIBUTING.md`.
- [ ] Call providers in this order (highest signal first):
  1. **108 Arogya Kavacha** (you can dial 108 from any phone — log the call centre's behaviour, language options, areas served, transfer protocol).
  2. **RED.Health Bangalore** — call their toll-free / website-listed number.
  3. **Medulance Bangalore** — same.
  4. **Dial4242 Bangalore** — confirm whether they actually serve Bangalore.
  5. **VMEDO** — Bangalore-HQ, should be reachable.
  6. **HelpNow Bangalore** — Mumbai-HQ, confirm Bangalore presence.
  7. **Ziqitza Bangalore** — confirm private/commercial arm vs. govt-108 arm.
  8. **Manipal Hospitals Ambulance** — call the main hospital, ask for ambulance dispatch.
  9. **Apollo Hospitals Ambulance** — same.
  10. **Narayana Health Ambulance** — same.
- [ ] For each call, update the relevant YAML file:
  - Replace `+91 00000 00000` with the confirmed number.
  - Set `status: verified`.
  - Set `last_verified_at: YYYY-MM-DD`.
  - Set `verified_by: <your initials>`.
  - Add a `call_logs` entry with date, outcome, notes.
  - Update fares, fleet count, hospital affiliations as confirmed.
- [ ] Commit each verified record as a separate small commit ("verify red-health-bangalore — answered, BLS+ALS confirmed, fare ₹X base").
- [ ] Push to main → CI validates → site auto-redeploys.

## 8. File RTI-1

**Why this is on you:** physical filing or postal mail.

- [ ] Print `sources/rti/rti-1-station-list.md`.
- [ ] Fill in your name, address, email, phone in the template.
- [ ] Attach a ₹10 Indian Postal Order made out to "PIO, NHM Karnataka".
- [ ] File in person at NHM office (Vikasa Soudha, 4th floor) or send by registered post with acknowledgement.
- [ ] Save the acknowledgement and update `sources/rti/README.md` with date filed + acknowledgement number.

## 9. Optional but high-leverage

- [ ] **Legal sanity-check the disclaimer.** A 1-hour consult with a Bangalore-based media/IT-Act lawyer to review `DISCLAIMER.md` and `TAKEDOWN.md`. Cost ~₹3-5k. Worth it.
- [ ] **Optional liability insurance.** Cyber & Media Liability rider on an existing personal policy. ~₹2-5k/year. Most insurers won't underwrite without a registered entity, but worth asking.
- [ ] **One independent reviewer for the methodology.** Reach out to a journalist (Deccan Herald health desk?) or civic-tech peer (OSM India, OHC) to spend 30 minutes on the README + CONTRIBUTING + site. If they're willing to be cited, that's launch-grade credibility.
- [ ] **Cloudflare Email Routing** for the alias addresses (free).

## 10. Deploy the Cloudflare Worker (forms backend)

**Why this is on you:** Cloudflare account + GitHub PAT.

The site has three submission forms (report a call, register a new service, claim a listing). Without the Worker, forms fall back to `mailto:` which works but is less clean. Deploying the Worker takes ~15 minutes.

- [ ] `cd workers/submit && npm install`
- [ ] Install wrangler globally if needed: `npm install -g wrangler`
- [ ] `wrangler login`
- [ ] `wrangler kv namespace create RATE` → copy the returned id into `wrangler.toml`
- [ ] Create a fine-grained GitHub PAT (Issues read+write, scoped to `Ashwask/SaralcareAmbulanceservices` only, 90-day expiry).
- [ ] `wrangler secret put GH_TOKEN` → paste the PAT
- [ ] `wrangler secret put GH_REPO` → e.g. `Ashwask/SaralcareAmbulanceservices`
- [ ] `wrangler deploy`
- [ ] In the GitHub repo: create issue labels `report`, `new-provider`, `provider-claim`, `correction`, `needs-moderation`, `needs-verification-call`, `needs-verification`.
- [ ] Cloudflare dashboard → Workers → ambulance-submit → Custom Domains → add e.g. `submit.ambulance.saralcare.com`.
- [ ] In Cloudflare Pages → ambulance-saralcare project → Settings → Environment variables → add `PUBLIC_SUBMIT_URL=https://submit.ambulance.saralcare.com/submit` (Production).
- [ ] Re-deploy the Pages project so the env var takes effect.
- [ ] Test: submit a dummy report from the live site, confirm the GitHub issue is created with the right labels.

Full details in `workers/README.md`.

## 11. Announce

- [ ] Verify the site once more — every page, every link, the disclaimer, the takedown email, the GitHub repo URL.
- [ ] Post the LinkedIn announcement from `launch/linkedin-post.md`. Use Version A on the brand page.
- [ ] Optionally crosspost on X / Twitter (Version B as a thread).
- [ ] Watch the inbox, the GitHub issues, and the comments for 72 hours.

---

## What's already done (by Claude)

For reference, here's what doesn't need any further setup:

- ✅ Full directory structure under `~/Documents/Saralcare_moat/Ambulances/`
- ✅ All three license files (CC-BY-NC-SA 4.0 / MIT / CC-BY-SA 4.0)
- ✅ README, CONTRIBUTING, COMMERCIAL, DISCLAIMER, TAKEDOWN, LICENSE-FAQ, GOVERNANCE, SCHEMA
- ✅ JSON Schemas for Provider, Vehicle, Hospital
- ✅ 10 seed provider records + 5 hospital records (all unverified, sources cited)
- ✅ Affiliation graph CSV (3 hospital-owned edges)
- ✅ TypeScript build pipeline: `validate.ts`, `build-api.ts`, `freshness-report.ts`, `reverify-queue.ts`
- ✅ Data ingestion scripts: `ingest-osm.ts`, `ingest-google-places.ts`, `ingest-justdial.ts`
- ✅ GitHub Actions workflows: validate (PR), deploy (main), reverify-queue (weekly cron)
- ✅ Astro static site with 25 pages: home (map + map-pan counter + pincode search), providers list + per-record, hospitals list + per-record, /providers/new (register your service), /claim (claim your listing), /freshness dashboard, about, license, disclaimer, takedown
- ✅ MapLibre + OSM map view — pan-to-filter "X providers in view" counter (BloodBridge pattern)
- ✅ Two-sided model: demand-side report form on every provider page (call experience reports → moderated), supply-side registration form, supply-side claim/correction form
- ✅ Cloudflare Worker (workers/submit/) for form submissions → GitHub issues with appropriate labels; mailto fallback if Worker is not deployed
- ✅ Reports schema + per-provider aggregation (answer rate, dispatch rate, median response, fare dispersion)
- ✅ Disclaimer banner on every page; no personal byline anywhere
- ✅ Public JSON API: /v1/providers.json, /v1/providers/{id}.json, /v1/hospitals.json, /v1/hospitals/{id}.json, /v1/by-pincode/{pin}.json, /v1/reports/{provider-id}.json, /v1/freshness.json, /v1/changelog.json
- ✅ RTI-1, RTI-2, RTI-3 drafts ready to print and file
- ✅ LinkedIn launch post drafted (short version + thread version)

Local validation passes (0 errors, 0 warnings). Site builds in ~1 second with `npm run site:build`. Ready to push.
